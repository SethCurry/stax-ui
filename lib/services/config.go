package services

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"sync"

	"github.com/mitchellh/go-homedir"
	"go.uber.org/zap"
)

func NewConfigService(logger *zap.Logger) *ConfigService {
	return &ConfigService{
		logger: logger,
		lock:   sync.Mutex{},
	}
}

type ConfigService struct {
	lock   sync.Mutex
	logger *zap.Logger
}

func NewDefaultConfig() *Config {
	return &Config{
		MoxfieldExports: []MoxfieldExportConfig{},
	}
}

type MoxfieldExportConfig struct {
	Username string `json:"username"`
	Path     string `json:"path"`
}

type XMageConfig struct {
	JavaPath    string `json:"java_path"`
	InstallPath string `json:"install_path"`
}

type Config struct {
	MoxfieldExports []MoxfieldExportConfig `json:"moxfield_exports"`
	XMage           XMageConfig            `json:"xmage"`
}

func (c *Config) Marshal() ([]byte, error) {
	return json.MarshalIndent(c, "", "  ")
}

func getConfigDirectory() (string, error) {
	userhome, err := homedir.Dir()
	if err != nil {
		return "", err
	}

	if runtime.GOOS == "windows" {
		return filepath.Join(userhome, "AppData", "Roaming", "staxui"), nil
	}
	return filepath.Join(userhome, ".config", "staxui"), nil
}

func getConfigFilePath() (string, error) {
	configDirectory, err := getConfigDirectory()
	if err != nil {
		return "", err
	}

	return filepath.Join(configDirectory, "config.json"), nil
}

func readConfigFromPath(configPath string) (*Config, error) {
	config := &Config{}

	configFile, err := os.Open(configPath)
	if err != nil {
		return nil, err
	}
	defer configFile.Close()

	err = json.NewDecoder(configFile).Decode(config)
	if err != nil {
		return nil, err
	}

	return config, nil
}

func getConfig() (*Config, error) {
	configPath, err := getConfigFilePath()
	if err != nil {
		return nil, err
	}

	return readConfigFromPath(configPath)
}

func writeConfig(newConfig *Config) error {
	configPath, err := getConfigFilePath()
	if err != nil {
		return err
	}

	configFile, err := os.Create(configPath)
	if err != nil {
		if os.IsNotExist(err) {
			configDirectory, err := getConfigDirectory()
			if err != nil {
				return err
			}

			os.MkdirAll(configDirectory, 0o700)

			configFile, err = os.Create(configPath)
			if err != nil {
				return err
			}
		} else {
			return err
		}
	}
	defer configFile.Close()

	configBytes, err := newConfig.Marshal()
	if err != nil {
		return err
	}

	configFile.Write(configBytes)

	return nil
}

func (c *ConfigService) GetConfig() (*Config, error) {
	c.lock.Lock()
	defer c.lock.Unlock()

	gotConfig, err := getConfig()
	if err != nil {
		if os.IsNotExist(err) {
			return NewDefaultConfig(), nil
		}
		fmt.Println("failed to read config file:", err.Error())
		return nil, err
	}

	return gotConfig, nil
}

func (c *ConfigService) WriteConfig(newConfig *Config) error {
	c.lock.Lock()
	defer c.lock.Unlock()

	fmt.Println("Writing config")

	err := writeConfig(newConfig)
	if err != nil {
		fmt.Println("Error writing config:", err.Error())
	}

	return err
}
