// kernel/types/eventbus.go
package types

type Event map[string]interface{}

type EventBus interface {
	Subscribe(eventName string, ch chan Event)
	Publish(eventName string, payload Event)
}
