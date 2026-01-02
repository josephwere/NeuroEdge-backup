package core

import (
	"fmt"
	"log"
	"os"
	"time"
)

// LogLevel type
type LogLevel int

const (
	DEBUG LogLevel = iota
	INFO
	WARN
	ERROR
	FATAL
)

// Logger is the unified logging system for NeuroEdge
type Logger struct {
	component string
	level     LogLevel
	file      *os.File
}

// NewLogger creates a new logger instance
func NewLogger(component string, level LogLevel, logFilePath string) *Logger {
	var file *os.File
	if logFilePath != "" {
		f, err := os.OpenFile(logFilePath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			log.Printf("Failed to open log file: %v\n", err)
		} else {
			file = f
		}
	}

	return &Logger{
		component: component,
		level:     level,
		file:      file,
	}
}

// logMessage formats and outputs a log message
func (l *Logger) logMessage(level LogLevel, message string) {
	if level < l.level {
		return
	}
	levelStr := map[LogLevel]string{
		DEBUG: "DEBUG",
		INFO:  "INFO",
		WARN:  "WARN",
		ERROR: "ERROR",
		FATAL: "FATAL",
	}[level]

	timestamp := time.Now().Format(time.RFC3339)
	logLine := fmt.Sprintf("[%s] [%s] [%s] %s\n", timestamp, l.component, levelStr, message)

	// Print to console
	fmt.Print(logLine)

	// Write to file if configured
	if l.file != nil {
		_, err := l.file.WriteString(logLine)
		if err != nil {
			fmt.Printf("[Logger] Failed to write to log file: %v\n", err)
		}
	}

	// Optional: remote telemetry can be added here
}

// Debug logs debug-level messages
func (l *Logger) Debug(msg string) {
	l.logMessage(DEBUG, msg)
}

// Info logs info-level messages
func (l *Logger) Info(msg string) {
	l.logMessage(INFO, msg)
}

// Warn logs warning-level messages
func (l *Logger) Warn(msg string) {
	l.logMessage(WARN, msg)
}

// Error logs error-level messages
func (l *Logger) Error(msg string) {
	l.logMessage(ERROR, msg)
}

// Fatal logs fatal-level messages and exits
func (l *Logger) Fatal(msg string) {
	l.logMessage(FATAL, msg)
	os.Exit(1)
}

// Close closes any open file handles
func (l *Logger) Close() {
	if l.file != nil {
		l.file.Close()
	}
}
