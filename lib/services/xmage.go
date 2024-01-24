package services

import (
	"os"
	"path/filepath"
	"runtime"

	"github.com/mitchellh/go-homedir"
	"go.uber.org/zap"
)

func getLocalDirectory() (string, error) {
	userHome, err := homedir.Dir()
	if err != nil {
		return "", err
	}

	if runtime.GOOS == "windows" {
		return filepath.Join(userHome, "AppData", "Local", "staxui"), nil
	}
	return filepath.Join(userHome, ".local", "share", "staxui"), nil
}

func getLocalXMageDirectory() (string, error) {
	localDirectory, err := getLocalDirectory()
	if err != nil {
		return "", err
	}

	return filepath.Join(localDirectory, "xmage"), nil
}

func NewXMageService(logger *zap.Logger) *XMageService {
	return &XMageService{
		logger: logger,
	}
}

type XMageService struct {
	logger *zap.Logger
}

// ensure working directory exists
// ensure libraries and binaries are symlinked in
// copy in config if it doesn't exist
// Change working directory

func (x *XMageService) StartClient() error {
	gotConfig, err := getConfig()
	if err != nil {
		x.logger.Error("failed to get config", zap.Error(err))
		return err
	}

	localXMageDir, err := getLocalXMageDirectory()
	if err != nil {
		x.logger.Error("failed to get local xmage directory", zap.Error(err))
		return err
	}

	versionName := filepath.Base(gotConfig.XMage.InstallPath)

	versionDir := filepath.Join(localXMageDir, versionName)

	if _, err := os.Stat(versionDir); os.IsNotExist(err) {
		err = os.MkdirAll(versionDir, 0o755)
		if err != nil {
			x.logger.Error("failed to create version directory", zap.Error(err))
			return err
		}
	}

	return nil
}
