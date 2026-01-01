package core

import "fmt"

type Engine interface {
	Start()
	Stop()
	Process(task string, context map[string]interface{}) string
	Name() string
}

type EngineManager struct {
	engines map[string]Engine
}

func NewEngineManager() *EngineManager {
	return &EngineManager{
		engines: make(map[string]Engine),
	}
}

func (em *EngineManager) AddEngine(name string, engine Engine) {
	em.engines[name] = engine
	fmt.Println("✅ Registered Engine:", name)
}

func (em *EngineManager) StartAll() {
	for _, engine := range em.engines {
		engine.Start()
	}
}

func (em *EngineManager) StopAll() {
	for _, engine := range em.engines {
		engine.Stop()
	}
}
