package main

import (
	"embed"

	"github.com/SethCurry/staxui/lib/services"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"go.uber.org/zap"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
	}

	// Create an instance of the app structure
	app := NewApp()

	configs := services.NewConfigService(logger.Named("config"))
	moxfieldService := services.NewMoxfieldService(logger.Named("moxfield"))

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "staxui",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			configs,
			moxfieldService,
		},
	})
	if err != nil {
		println("Error:", err.Error())
	}
}
