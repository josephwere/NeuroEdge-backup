package mesh

import "fmt"

// Simple routing table for demonstration
type RoutingTable struct {
	routes map[string]string // destinationNodeID -> nextHopNodeID
}

// NewRoutingTable initializes a routing table
func NewRoutingTable() *RoutingTable {
	return &RoutingTable{
		routes: make(map[string]string),
	}
}

// AddRoute adds a route to the table
func (r *RoutingTable) AddRoute(destination, nextHop string) {
	r.routes[destination] = nextHop
	fmt.Printf("[Routing] Route added: %s -> %s\n", destination, nextHop)
}

// GetNextHop retrieves the next hop for a destination
func (r *RoutingTable) GetNextHop(destination string) string {
	if next, ok := r.routes[destination]; ok {
		return next
	}
	return ""
}
