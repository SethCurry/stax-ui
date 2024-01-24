package moxfield

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/SethCurry/stax/integrations/moxfield"
	"github.com/SethCurry/stax/integrations/xmage"
)

func NewMoxfieldService() *MoxfieldService {
	return &MoxfieldService{}
}

type MoxfieldService struct{}

func (m *MoxfieldService) ExportDecksToXMage(username string, outputDir string) error {
	if _, err := os.Stat(outputDir); os.IsNotExist(err) {
		err = os.MkdirAll(outputDir, 0o755)
		if err != nil {
			fmt.Println("failed to create output directory", err.Error())
			return err
		}
	}

	client := moxfield.NewClient(http.DefaultClient)

	decks, err := client.ListUserDecks(username, moxfield.ListUserDecksRequest{
		PageSize: 100,
	})
	if err != nil {
		fmt.Println("failed to list user decks", err.Error())
		return err
	}

	for _, deck := range decks.Data {
		if deck.Format != "commander" {
			continue
		}

		if !deck.IsLegal {
			fmt.Println("deck is not legal", deck.PublicID, deck.Name)
			continue
		}

		deckList, err := client.GetDeckList(deck.PublicID)
		if err != nil {
			fmt.Println("failed to export deck list", err.Error())
			continue
		}
		deckLines := strings.Split(string(deckList), "\n")

		cards := []xmage.DeckCard{}
		sideboard := []xmage.DeckCard{}

		for idx, line := range deckLines {
			if line == "" {
				continue
			}

			parsed, err := moxfield.ParseDeckListLine(line)
			if err != nil {
				fmt.Println("failed trying to parse deck list line", err.Error())
				continue
			}

			newCard := xmage.DeckCard{
				Name:            parsed.Name,
				Quantity:        parsed.Quantity,
				CollectorNumber: parsed.CollectorNumber,
				SetCode:         parsed.Set,
			}

			if idx == 0 {
				sideboard = append(sideboard, newCard)
			} else {
				cards = append(cards, newCard)
			}
		}

		xmageDeck := xmage.NewDeckList(deck.Name, cards, sideboard)
		marshalled := xmageDeck.MarshalDck()
		outputFile := filepath.Join(outputDir, deck.Name+".dck")
		outputFd, err := os.Create(outputFile)
		if err != nil {
			fmt.Println("failed to create output file", err.Error())
		}
		outputFd.Write([]byte(marshalled))
		outputFd.Sync()
		outputFd.Close()
	}

	return nil
}
