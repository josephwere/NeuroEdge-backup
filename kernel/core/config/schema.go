package config

// ConfigSchema defines all configurable parameters for NeuroEdge Kernel
type ConfigSchema struct {
	Environment   string `json:"environment"`   // "dev", "staging", "prod"
	LogLevel      string `json:"log_level"`     // "DEBUG", "INFO", "WARN", "ERROR", "FATAL"
	LogFile       string `json:"log_file"`      // path to log file
	EventBusType  string `json:"event_bus"`     // "kafka", "redis", "nats"
	EnableMesh    bool   `json:"enable_mesh"`   // Enable edge mesh
	MaxWorkers    int    `json:"max_workers"`   // Number of concurrent tasks
	EnableTelemetry bool `json:"enable_telemetry"` // Remote telemetry
	FeatureFlags  map[string]bool `json:"feature_flags"` // Optional features
}
