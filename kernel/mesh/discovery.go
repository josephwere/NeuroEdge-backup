package mesh

import (
	"fmt"
	"sync"
	"time"
)

// NodeRegistry holds all known nodes
type NodeRegistry struct {
	nodes map[string]*Node
	mu    sync.RWMutex
}

// NewNodeRegistry initializes the registry
func NewNodeRegistry() *NodeRegistry {
	return &NodeRegistry{
		nodes: make(map[string]*Node),
	}
}

// RegisterNode adds a new node or updates existing
func (r *NodeRegistry) RegisterNode(node *Node) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.nodes[node.ID] = node
	fmt.Printf("[Discovery] Node %s registered/updated\n", node.ID)
}

// DiscoverNodes simulates discovering nearby nodes
func (r *NodeRegistry) DiscoverNodes() []*Node {
	r.mu.RLock()
	defer r.mu.RUnlock()
	result := []*Node{}
	for _, n := range r.nodes {
		result = append(result, n)
	}
	fmt.Printf("[Discovery] %d nodes discovered\n", len(result))
	return result
}

// HeartbeatChecker removes dead nodes
func (r *NodeRegistry) HeartbeatChecker(timeout time.Duration) {
	for {
		time.Sleep(timeout)
		r.mu.Lock()
		for id, node := range r.nodes {
			if time.Since(node.LastSeen) > timeout {
				fmt.Printf("[Discovery] Node %s timed out and removed\n", id)
				delete(r.nodes, id)
			}
		}
		r.mu.Unlock()
	}
}
