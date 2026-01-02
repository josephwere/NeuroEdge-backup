package mesh

import (
	"fmt"
	"sync"
	"time"
)

// MeshManager coordinates discovery, routing, messaging & security
type MeshManager struct {
	NodeID        string
	Registry      *NodeRegistry
	Routing       *RoutingTable
	EncryptionKey []byte
	mu            sync.Mutex
}

// NewMeshManager initializes the mesh controller
func NewMeshManager(nodeID string, encryptionKey []byte) *MeshManager {
	return &MeshManager{
		NodeID:        nodeID,
		Registry:      NewNodeRegistry(),
		Routing:       NewRoutingTable(),
		EncryptionKey: encryptionKey,
	}
}

// Start launches background services
func (m *MeshManager) Start() {
	fmt.Println("🌐 Mesh Manager started")

	// Start heartbeat watcher
	go m.Registry.HeartbeatChecker(15 * time.Second)

	// Periodic self-advertisement
	go func() {
		for {
			time.Sleep(10 * time.Second)
			m.AdvertiseSelf()
		}
	}()
}

// Advertise this node to the network
func (m *MeshManager) AdvertiseSelf() {
	node := &Node{
		ID:         m.NodeID,
		IP:         "127.0.0.1",
		Port:       9000,
		LastSeen:   time.Now(),
		TrustScore: 100,
	}
	m.Registry.RegisterNode(node)
	fmt.Printf("[Mesh] Node %s advertised\n", m.NodeID)
}

// SendSecureMessage encrypts and sends a message
func (m *MeshManager) SendSecureMessage(to string, payload string) error {
	encrypted, err := Encrypt(m.EncryptionKey, payload)
	if err != nil {
		return err
	}

	msg := Message{
		From:    m.NodeID,
		To:      to,
		Payload: string(encrypted),
	}

	SendMessage(msg)
	return nil
}

// ReceiveSecureMessage decrypts incoming message
func (m *MeshManager) ReceiveSecureMessage(from string, encryptedPayload []byte) (string, error) {
	msg, err := Decrypt(m.EncryptionKey, encryptedPayload)
	if err != nil {
		return "", err
	}

	fmt.Printf("[Mesh] Message received from %s: %s\n", from, msg)
	return msg, nil
}
