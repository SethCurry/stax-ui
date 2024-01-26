package services

import (
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"

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
func (x *XMageService) StartXmage() error {
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

	ensureDirectoriesExist := []string{
		versionDir,
		filepath.Join(versionDir, "mage-client"),
		filepath.Join(versionDir, "mage-client", "gamelogs"),
		filepath.Join(versionDir, "mage-client", "gamelogsJson"),
		filepath.Join(versionDir, "mage-client", "backgrounds"),
		filepath.Join(versionDir, "mage-client", "db"),
		filepath.Join(versionDir, "mage-client", "plugins"),
	}

	xmageInstall := gotConfig.XMage.InstallPath

	ensureSymlinksExist := map[string]string{
		filepath.Join(xmageInstall, "xmage", "mage-client", "lib"):               filepath.Join(versionDir, "mage-client", "lib"),
		filepath.Join(xmageInstall, "xmage", "mage-client", "plugins", "images"): filepath.Join(versionDir, "mage-client", "plugins", "images"),
		filepath.Join(xmageInstall, "xmage", "mage-client", "config"):            filepath.Join(versionDir, "mage-client", "config"),
		filepath.Join(xmageInstall, "xmage", "mage-client", "sounds"):            filepath.Join(versionDir, "mage-client", "sounds"),
	}

	ensureFilesCopied := map[string]string{
		filepath.Join(xmageInstall, "xmage", "mage-client", "cacerts"): filepath.Join(versionDir, "mage-client", "cacerts"),
	}

	for _, v := range ensureDirectoriesExist {
		if _, err := os.Stat(v); os.IsNotExist(err) {
			err = os.MkdirAll(v, 0o755)
			if err != nil {
				x.logger.Error("failed to create directory", zap.String("path", v), zap.Error(err))
				return err
			}
		}
	}

	for from, to := range ensureSymlinksExist {
		if _, err := os.Stat(to); os.IsNotExist(err) {
			// err = os.Symlink(from, to)
			err = exec.Command("cmd", "/C", "mklink", "/J", to, from).Run()
			if err != nil {
				x.logger.Error("failed to create symlink", zap.String("from", from), zap.String("to", to), zap.Error(err))
				return err
			}
		}
	}

	for from, to := range ensureFilesCopied {
		toFd, err := os.Create(to)
		if err != nil {
			x.logger.Error("failed to create file", zap.String("path", to), zap.Error(err))
			return err
		}
		defer toFd.Close()

		fromFd, err := os.Open(from)
		if err != nil {
			x.logger.Error("failed to open file", zap.String("path", from), zap.Error(err))
			return err
		}
		defer fromFd.Close()

		_, err = io.Copy(toFd, fromFd)
		if err != nil {
			x.logger.Error("failed to copy file", zap.String("from", from), zap.String("to", to), zap.Error(err))
			return err
		}
		toFd.Close()
		fromFd.Close()
	}

	minMemoryMB := int(gotConfig.XMage.MinMemoryGB * 1024)
	maxMemoryMB := int(gotConfig.XMage.MaxMemoryGB * 1024)

	cmd := exec.Command(
		"cmd",
		"/C",
		//"start",
		filepath.Join(gotConfig.XMage.JavaPath, "bin", "java"),
		"-Xms"+strconv.Itoa(minMemoryMB)+"m",
		"-Xmx"+strconv.Itoa(maxMemoryMB)+"m",
		"-Dfile.encoding=UTF-8",
		"-jar",
		"./lib/mage-client-1.4.50.jar")

	cmd.Dir = filepath.Join(versionDir, "mage-client")
	cmd.Env = os.Environ()
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	return cmd.Start()
}
