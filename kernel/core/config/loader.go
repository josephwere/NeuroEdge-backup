package config

import (
	"encoding/json"
	"fmt"
	"os"
)

// Config holds the loaded configuration
var Config *ConfigSchema

// LoadConfig loads configuration from a JSON file
func LoadConfig(path string) error {
	file, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("failed to open config file: %v", err)
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	cfg := &ConfigSchema{}
	if err := decoder.Decode(cfg); err != nil {
		return fmt.Errorf("failed to parse config file: %v", err)
	}

	// Set defaults if missing
	if cfg.Environment == "" {
		cfg.Environment = "dev"
	}
	if cfg.LogLevel == "" {
		cfg.LogLevel = "INFO"
	}
	if cfg.MaxWorkers == 0 {
		cfg.MaxWorkers = 10
	}

	Config = cfg
	fmt.Printf("✅ Config loaded: environment=%s, log_level=%s\n", cfg.Environment, cfg.LogLevel)
	return nil
}
