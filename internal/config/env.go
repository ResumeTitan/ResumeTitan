package config

import (
	"fmt"
	"os"
	"strings"
)

type Config struct {
	Host string
	Port string
}

func Load() (Config, error) {
	var missing []string

	host := getEnvOrDefault("HOST", "0.0.0.0")

	port := getEnvOrDefault("PORT", "8080")

	if len(missing) > 0 {
		return Config{}, fmt.Errorf("missing required env vars: %s", strings.Join(missing, ", "))
	}

	return Config{
		Host: host,
		Port: port,
	}, nil
}

// Get environment variable, or return default fallback string.
// Used for optional env variables
func getEnvOrDefault(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok && strings.TrimSpace(key) != "" {
		return val
	}

	return fallback
}
