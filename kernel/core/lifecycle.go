package core

import (
	"fmt"
	"sync"
	"time"
)

// LifecycleController manages boot, shutdown, restart, and crash recovery.
type LifecycleController struct {
	mu            sync.Mutex
	isRunning     bool
	restartPolicy string
	hooks         []func()
}

// NewLifecycleController creates a new controller
func NewLifecycleController(restartPolicy string) *LifecycleController {
	return &LifecycleController{
		restartPolicy: restartPolicy,
		hooks:         []func(){},
	}
}

// RegisterHook allows modules to register pre-shutdown hooks
func (lc *LifecycleController) RegisterHook(hook func()) {
	lc.mu.Lock()
	defer lc.mu.Unlock()
	lc.hooks = append(lc.hooks, hook)
}

// Start boots the kernel safely
func (lc *LifecycleController) Start(startFunc func()) {
	lc.mu.Lock()
	if lc.isRunning {
		fmt.Println("[Lifecycle] Kernel already running.")
		lc.mu.Unlock()
		return
	}
	lc.isRunning = true
	lc.mu.Unlock()

	fmt.Println("[Lifecycle] Starting kernel...")
	defer lc.handlePanic(startFunc)
	startFunc()
}

// Shutdown executes graceful shutdown
func (lc *LifecycleController) Shutdown() {
	lc.mu.Lock()
	if !lc.isRunning {
		fmt.Println("[Lifecycle] Kernel is not running.")
		lc.mu.Unlock()
		return
	}
	lc.isRunning = false
	lc.mu.Unlock()

	fmt.Println("[Lifecycle] Initiating graceful shutdown...")
	for _, hook := range lc.hooks {
		hook()
	}
	fmt.Println("[Lifecycle] Shutdown complete.")
}

// Restart applies the restart policy
func (lc *LifecycleController) Restart(startFunc func()) {
	fmt.Println("[Lifecycle] Restarting kernel with policy:", lc.restartPolicy)
	lc.Shutdown()
	time.Sleep(2 * time.Second)
	lc.Start(startFunc)
}

// handlePanic recovers from panics and applies restart policy
func (lc *LifecycleController) handlePanic(startFunc func()) {
	if r := recover(); r != nil {
		fmt.Println("[Lifecycle] Kernel panic detected:", r)
		if lc.restartPolicy == "auto" {
			fmt.Println("[Lifecycle] Restarting automatically...")
			lc.Restart(startFunc)
		} else {
			fmt.Println("[Lifecycle] Manual restart required.")
		}
	}
}

// IsRunning returns current status
func (lc *LifecycleController) IsRunning() bool {
	lc.mu.Lock()
	defer lc.mu.Unlock()
	return lc.isRunning
}
