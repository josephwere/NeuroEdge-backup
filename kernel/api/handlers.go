package handlers

import (
	"encoding/json"
	"net/http"

	"neuroedge/kernel/core"
	"neuroedge/kernel/discovery"
	"neuroedge/kernel/types"
)

// HealthHandler returns JSON of all component health
func HealthHandler(w http.ResponseWriter, r *http.Request) {
	hm := core.GlobalHealthManager
	statuses := hm.StatusesSnapshot() // Thread-safe snapshot

	health := []types.KernelHealth{}
	for _, s := range statuses {
		errStr := ""
		if s.LastError != nil {
			errStr = s.LastError.Error()
		}
		health = append(health, types.KernelHealth{
			Component: s.Name,
			Healthy:   s.Healthy,
			LastCheck: s.LastCheck,
			Error:     errStr,
		})
	}

	writeJSON(w, health)
}

// NodesHandler returns all nodes (kernel, agents, engines)
func NodesHandler(w http.ResponseWriter, r *http.Request) {
	nodes := discovery.GetNodes()
	writeJSON(w, nodes)
}

// CapabilitiesHandler returns all registered agents & engines
func CapabilitiesHandler(w http.ResponseWriter, r *http.Request) {
	capabilities := discovery.GetCapabilities()
	writeJSON(w, capabilities)
}

// Helper to write JSON responses
func writeJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
