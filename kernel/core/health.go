package core

import (
	"fmt"
	"sync"
	"time"
)

// HealthStatus represents a component's health state
type HealthStatus struct {
	Component string
	Healthy   bool
	Message   string
	LastCheck time.Time
}

// HealthMonitor manages health checks for all components
type HealthMonitor struct {
	mu         sync.Mutex
	components map[string]*HealthStatus
	tickers    map[string]*time.Ticker
}

// NewHealthMonitor initializes the monitor
func NewHealthMonitor() *HealthMonitor {
	return &HealthMonitor{
		components: make(map[string]*HealthStatus),
		tickers:    make(map[string]*time.Ticker),
	}
}

// RegisterComponent adds a component to monitor
func (hm *HealthMonitor) RegisterComponent(name string) {
	hm.mu.Lock()
	defer hm.mu.Unlock()
	hm.components[name] = &HealthStatus{
		Component: name,
		Healthy:   true,
		Message:   "Registered",
		LastCheck: time.Now(),
	}
	fmt.Println("[HealthMonitor] Component registered:", name)
}

// UpdateStatus updates the health of a component
func (hm *HealthMonitor) UpdateStatus(name string, healthy bool, message string) {
	hm.mu.Lock()
	defer hm.mu.Unlock()
	if comp, exists := hm.components[name]; exists {
		comp.Healthy = healthy
		comp.Message = message
		comp.LastCheck = time.Now()
		fmt.Printf("[HealthMonitor] %s status updated: %v (%s)\n", name, healthy, message)
	}
}

// StartHeartbeat starts periodic health checks for a component
func (hm *HealthMonitor) StartHeartbeat(name string, interval time.Duration, checkFunc func() bool) {
	hm.mu.Lock()
	if _, exists := hm.tickers[name]; exists {
		hm.mu.Unlock()
		return
	}
	ticker := time.NewTicker(interval)
	hm.tickers[name] = ticker
	hm.mu.Unlock()

	go func() {
		for range ticker.C {
			status := checkFunc()
			message := "OK"
			if !status {
				message = "Issue detected"
			}
			hm.UpdateStatus(name, status, message)
		}
	}()
}

// GetStatus retrieves current health status of all components
func (hm *HealthMonitor) GetStatus() []HealthStatus {
	hm.mu.Lock()
	defer hm.mu.Unlock()
	statuses := []HealthStatus{}
	for _, comp := range hm.components {
		statuses = append(statuses, *comp)
	}
	return statuses
}

// PrintStatus prints a snapshot of all component health
func (hm *HealthMonitor) PrintStatus() {
	hm.mu.Lock()
	defer hm.mu.Unlock()
	fmt.Println("=== Health Monitor Snapshot ===")
	for _, comp := range hm.components {
		fmt.Printf("[%s] Healthy: %v | LastCheck: %s | Message: %s\n",
			comp.Component, comp.Healthy, comp.LastCheck.Format(time.RFC3339), comp.Message)
	}
	fmt.Println("===============================")
}
