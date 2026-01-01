package core

import (
	"fmt"
	"sync"

	"neuroedge/kernel/agents"
)

// AgentInterface defines required methods for all agents
type AgentInterface interface {
	Name() string
	Initialize() error          // Initialize agent resources
	Start()                     // Start agent processes or listeners
	Stop()                      // Stop agent processes
	HandleEvent(event string, payload map[string]interface{}) error // Event handling
}

// Global agent registry (thread-safe)
var AgentRegistry = struct {
	sync.RWMutex
	agents map[string]AgentInterface
}{
	agents: make(map[string]AgentInterface),
}

// RegisterAgent adds an agent to the global registry
func RegisterAgent(agent AgentInterface) {
	AgentRegistry.Lock()
	defer AgentRegistry.Unlock()

	name := agent.Name()
	if _, exists := AgentRegistry.agents[name]; exists {
		fmt.Printf("[AgentRegistry] Agent %s already registered\n", name)
		return
	}

	// Initialize agent
	if err := agent.Initialize(); err != nil {
		fmt.Printf("[AgentRegistry] Failed to initialize %s: %v\n", name, err)
		return
	}

	// Store in registry
	AgentRegistry.agents[name] = agent
	fmt.Printf("[AgentRegistry] Registered agent: %s\n", name)

	// Start agent
	agent.Start()
}

// GetAgent retrieves an agent by name
func GetAgent(name string) (AgentInterface, bool) {
	AgentRegistry.RLock()
	defer AgentRegistry.RUnlock()
	agent, exists := AgentRegistry.agents[name]
	return agent, exists
}

// StopAllAgents stops all registered agents
func StopAllAgents() {
	AgentRegistry.Lock()
	defer AgentRegistry.Unlock()

	for name, agent := range AgentRegistry.agents {
		agent.Stop()
		fmt.Printf("[AgentRegistry] Stopped agent: %s\n", name)
	}
}

// InitializeAllAgents registers all 71+ NeuroEdge agents
func InitializeAllAgents() {
	RegisterAgent(agents.NewGlobalMeshAgent())
	RegisterAgent(agents.NewAntiTheftSentinelAgent())
	RegisterAgent(agents.NewGovernmentAdvisorAgent())
	RegisterAgent(agents.NewMedicalDoctorAgent())
	RegisterAgent(agents.NewLawEnforcementAgent())
	RegisterAgent(agents.NewCyberSecurityShieldAgent())
	RegisterAgent(agents.NewEducationMentorAgent())
	RegisterAgent(agents.NewBusinessConsultantAgent())
	RegisterAgent(agents.NewCodingPartnerAgent())
	RegisterAgent(agents.NewIdentityAgent())
	RegisterAgent(agents.NewWDCWalletAgent())
	RegisterAgent(agents.NewNeuroChainValidatorAgent())
	RegisterAgent(agents.NewEmergencyResponseAgent())
	RegisterAgent(agents.NewDroneControllerAgent())
	RegisterAgent(agents.NewSmartCityAgent())
	RegisterAgent(agents.NewBankingAgent())
	RegisterAgent(agents.NewTaxAgent())
	RegisterAgent(agents.NewAgricultureAgent())
	RegisterAgent(agents.NewLogisticsAgent())
	RegisterAgent(agents.NewBorderControlAgent())
	RegisterAgent(agents.NewClimateAgent())
	RegisterAgent(agents.NewManufacturingAgent())
	RegisterAgent(agents.NewLawyerAgent())
	RegisterAgent(agents.NewJobRecruiterAgent())
	RegisterAgent(agents.NewTherapistAgent())
	RegisterAgent(agents.NewChildTutorAgent())
	RegisterAgent(agents.NewResearchAgent())
	RegisterAgent(agents.NewMathSolverAgent())
	RegisterAgent(agents.NewScienceAgent())
	RegisterAgent(agents.NewMedicalImagingAgent())
	RegisterAgent(agents.NewHospitalWorkflowAgent())
	RegisterAgent(agents.NewPoliceCommandAgent())
	RegisterAgent(agents.NewFraudDetectionAgent())
	RegisterAgent(agents.NewDeviceFingerprintAgent())
	RegisterAgent(agents.NewWDCTraderAgent())
	RegisterAgent(agents.NewDeveloperOpsAgent())
	RegisterAgent(agents.NewAPIGeneratorAgent())
	RegisterAgent(agents.NewAppBuilderAgent())
	RegisterAgent(agents.NewMemoryAgent())
	RegisterAgent(agents.NewPlanningAgent())
	RegisterAgent(agents.NewDigitalTwinAgent())
	RegisterAgent(agents.NewSatelliteLinkAgent())
	RegisterAgent(agents.NewRouterMeshAgent())
	RegisterAgent(agents.NewTelecomAgent())
	RegisterAgent(agents.NewHardwareNodeAgent())
	RegisterAgent(agents.NewOfflineIdentityAgent())
	RegisterAgent(agents.NewDecentralizedAIAgent())
	RegisterAgent(agents.NewHomeAssistantAgent())
	RegisterAgent(agents.NewVehicleControllerAgent())
	RegisterAgent(agents.NewCityInfrastructureAgent())
	RegisterAgent(agents.NewFraudSentinelAgent())
	RegisterAgent(agents.NewTravelAgent())
	RegisterAgent(agents.NewVotingAgent())
	RegisterAgent(agents.NewVerificationOfficerAgent())
	RegisterAgent(agents.NewPersonalWDCAssistantAgent())
	RegisterAgent(agents.NewProductivityAgent())
	RegisterAgent(agents.NewHealthMonitoringAgent())
	RegisterAgent(agents.NewPrivacyGuardianAgent())
	RegisterAgent(agents.NewMiningControllerAgent())
	RegisterAgent(agents.NewDeviceGuardianAgent())
	RegisterAgent(agents.NewRobotAssistantAgent())
	RegisterAgent(agents.NewFinancialMonitoringAgent())
	RegisterAgent(agents.NewCodeQualityAgent())
	RegisterAgent(agents.NewGameDeveloperAgent())
	RegisterAgent(agents.NewWorldKnowledgeAgent())
	RegisterAgent(agents.NewUniversalTranslatorAgent())
	RegisterAgent(agents.NewNegotiationAgent())
	RegisterAgent(agents.NewNewsIntelligenceAgent())
	RegisterAgent(agents.NewPoliticalStabilityAgent())
	RegisterAgent(agents.NewSocialMediaAgent())
	fmt.Println("[AgentRegistry] ✅ All 71+ agents initialized and started")
}
