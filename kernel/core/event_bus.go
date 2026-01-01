package core

import "sync"

type EventBus struct {
	subscribers map[string][]chan map[string]interface{}
	lock        sync.RWMutex
}

func NewEventBus() *EventBus {
	return &EventBus{
		subscribers: make(map[string][]chan map[string]interface{}),
	}
}

func (bus *EventBus) Subscribe(event string, ch chan map[string]interface{}) {
	bus.lock.Lock()
	defer bus.lock.Unlock()
	bus.subscribers[event] = append(bus.subscribers[event], ch)
}

func (bus *EventBus) Publish(event string, data map[string]interface{}) {
	bus.lock.RLock()
	defer bus.lock.RUnlock()
	for _, ch := range bus.subscribers[event] {
		go func(c chan map[string]interface{}) {
			c <- data
		}(ch)
	}
}
