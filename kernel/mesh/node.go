package mesh

import (
	"fmt"
	"time"
)

// Node represents a device/node in the mesh network
type Node struct {
	ID         string
	IP         string
	Port       int
	LastSeen   time.Time
	TrustScore float64
}

// UpdateHeartbeat updates node's last seen time
func (n *Node) UpdateHeartbeat() {
	n.LastSeen = time.Now()
	fmt.Printf("[Node %s] Heartbeat updated at %s\n", n.ID, n.LastSeen)
}

// AdjustTrust adjusts the node's trust score
func (n *Node) AdjustTrust(delta float64) {
	n.TrustScore += delta
	if n.TrustScore > 100 {
		n.TrustScore = 100
	}
	if n.TrustScore < 0 {
		n.TrustScore = 0
	}
	fmt.Printf("[Node %s] TrustScore updated to %.2f\n", n.ID, n.TrustScore)
}
