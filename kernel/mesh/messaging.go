package mesh

import "fmt"

// Message represents a mesh network message
type Message struct {
	From    string
	To      string
	Payload string
}

// SendMessage sends a message to another node
func SendMessage(msg Message) {
	// In production: would use UDP/TCP/WebRTC
	fmt.Printf("[Messaging] %s -> %s | Payload: %s\n", msg.From, msg.To, msg.Payload)
}
