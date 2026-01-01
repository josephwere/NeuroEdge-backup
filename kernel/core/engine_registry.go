package core

import (
	"fmt"
	"neuroedge/kernel/engines"
)

// EngineInterface ensures all engines implement these methods
type EngineInterface interface {
	Start()
	Stop()
	Name() string
}

// EngineRegistry keeps track of all engines
type EngineRegistry struct {
	Engines map[string]EngineInterface
	EventBus *EventBus
}

// NewEngineRegistry creates a new registry
func NewEngineRegistry(bus *EventBus) *EngineRegistry {
	return &EngineRegistry{
		Engines: make(map[string]EngineInterface),
		EventBus: bus,
	}
}

// RegisterEngine registers a single engine
func (r *EngineRegistry) RegisterEngine(engine EngineInterface) {
	name := engine.Name()
	r.Engines[name] = engine
	fmt.Println("[EngineRegistry] Registered engine:", name)
	engine.Start()
}

// RegisterAllEngines registers all 42 engines
func (r *EngineRegistry) RegisterAllEngines() {
	r.RegisterEngine(engines.NewNeuroLogicEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroGPTEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroVisionEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroAudioEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroCodeEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroOpsEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroDataEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroSearchEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroMedicalEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroFinanceEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroGovEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroLegalEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroSecurityEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroEdgeMeshEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroWDCWalletEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroChainValidatorEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroIdentityEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroAPIEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroMemoryEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroTranslateEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroEmotionsEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroMathEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroQuantumEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroComputeEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroHumanEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroTeacherEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroCEOEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroTradeEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroHREngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroResearchEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroCreatorEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuro3DEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroRobotEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroGeoEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroEdgeAntiTheftEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroDefenseEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroCloudEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroOfflineEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroSensorsEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroAgentsCoreEngine(r.EventBus))
	r.RegisterEngine(engines.NewNeuroComputeOptimizer(r.EventBus))
	r.RegisterEngine(engines.NewNeuroFusionEngine(r.EventBus))
	fmt.Println("[EngineRegistry] All 42 engines registered and started ✅")
}

// StopAllEngines stops all engines
func (r *EngineRegistry) StopAllEngines() {
	for name, engine := range r.Engines {
		engine.Stop()
		fmt.Println("[EngineRegistry] Stopped engine:", name)
	}
}
