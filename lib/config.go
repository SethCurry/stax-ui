package config

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"sync"

	"github.com/mitchellh/go-homedir"
)

func NewConfigService() *ConfigService {
	return &ConfigService{}
}

type ConfigService struct {
	lock sync.Mutex
}

func NewDefaultConfig() *Config {
	return &Config{
		MoxfieldUsername: "",
	}
}

type Config struct {
	MoxfieldUsername string `json:"moxfield_username"`
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

	configFile, err := os.OpenFile(configPath, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0o600)
	if err != nil {
		return err
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
	}

	return gotConfig, nil
}

func (c *ConfigService) WriteConfig(newConfig *Config) error {
	c.lock.Lock()
	defer c.lock.Unlock()

	return writeConfig(newConfig)
}
