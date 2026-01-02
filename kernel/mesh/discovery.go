package mesh

import (
	"fmt"
	"sync"
)

// Discovery handles finding new nodes and maintaining a registry
type Discovery struct {
	nodes map[string]*Node
	mu    sync.Mutex
}

// NewDiscovery creates a discovery instance
func NewDiscovery() *Discovery {
	return &Discovery{
		nodes: make(map[string]*Node),
	}
}

// RegisterNode adds a node to the mesh
func (d *Discovery) RegisterNode(node *Node) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.nodes[node.ID] = node
	fmt.Printf("✅ Node registered: %s\n", node.ID)
}

// RemoveNode removes a node from the mesh
func (d *Discovery) RemoveNode(nodeID string) {
	d.mu.Lock()
	defer d.mu.Unlock()
	delete(d.nodes, nodeID)
	fmt.Printf("🗑 Node removed: %s\n", nodeID)
}

// GetActiveNodes returns all currently active nodes
func (d *Discovery) GetActiveNodes() []*Node {
	d.mu.Lock()
	defer d.mu.Unlock()
	var active []*Node
	for _, n := range d.nodes {
		if n.IsActive {
			active = append(active, n)
		}
	}
	return active
}
