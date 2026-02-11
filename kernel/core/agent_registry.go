//kernel/core/agent_registry.go
package core

import (
	"fmt"
	"sync"

	"neuroedge/kernel/agents"
	"neuroedge/kernel/types"
)

// AgentInterface matches the currently implemented agent contract.
type AgentInterface interface {
	Name() string
	Start()
	Stop()
	EvaluatePerformance() bool
	Learn()
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

	AgentRegistry.agents[name] = agent
	fmt.Printf("[AgentRegistry] Registered agent: %s\n", name)
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

// GetAllAgents returns all registered agents
func GetAllAgents() []AgentInterface {
	AgentRegistry.RLock()
	defer AgentRegistry.RUnlock()
	all := make([]AgentInterface, 0, len(AgentRegistry.agents))
	for _, a := range AgentRegistry.agents {
		all = append(all, a)
	}
	return all
}

// InitializeAllAgents keeps the full desired agent list, but only registers
// factories that currently exist/export in the agents package.
func InitializeAllAgents() {
	bus := types.NewEventBus()

	availableFactories := map[string]func(*types.EventBus) agents.Agent{
		"GlobalMeshAgent":   agents.NewGlobalMeshAgent,
		"ReasoningAgent":    agents.NewReasoningAgent,
		"TaskAgent":         agents.NewTaskAgent,
		"SecurityAgent":     agents.NewSecurityAgent,
		"PolicyEthicsAgent": agents.NewPolicyEthicsAgent,
		"PlanningAgent":     agents.NewPlanningAgent,
	}

	desiredOrder := []string{
		"GlobalMeshAgent",
		"ReasoningAgent",
		"TaskAgent",
		"SecurityAgent",
		"PolicyEthicsAgent",
		"AntiTheftSentinelAgent",
		"GovernmentAdvisorAgent",
		"MedicalDoctorAgent",
		"LawEnforcementAgent",
		"CyberSecurityShieldAgent",
		"EducationMentorAgent",
		"BusinessConsultantAgent",
		"CodingPartnerAgent",
		"IdentityAgent",
		"WDCWalletAgent",
		"NeuroChainValidatorAgent",
		"EmergencyResponseAgent",
		"DroneControllerAgent",
		"SmartCityAgent",
		"BankingAgent",
		"TaxAgent",
		"AgricultureAgent",
		"LogisticsAgent",
		"BorderControlAgent",
		"ClimateAgent",
		"ManufacturingAgent",
		"LawyerAgent",
		"JobRecruiterAgent",
		"TherapistAgent",
		"ChildTutorAgent",
		"ResearchAgent",
		"MathSolverAgent",
		"ScienceAgent",
		"MedicalImagingAgent",
		"HospitalWorkflowAgent",
		"PoliceCommandAgent",
		"FraudDetectionAgent",
		"DeviceFingerprintAgent",
		"WDCTraderAgent",
		"DeveloperOpsAgent",
		"APIGeneratorAgent",
		"AppBuilderAgent",
		"MemoryAgent",
		"PlanningAgent",
		"DigitalTwinAgent",
		"SatelliteLinkAgent",
		"RouterMeshAgent",
		"TelecomAgent",
		"HardwareNodeAgent",
		"OfflineIdentityAgent",
		"DecentralizedAIAgent",
		"HomeAssistantAgent",
		"VehicleControllerAgent",
		"CityInfrastructureAgent",
		"FraudSentinelAgent",
		"TravelAgent",
		"VotingAgent",
		"VerificationOfficerAgent",
		"PersonalWDCAssistantAgent",
		"ProductivityAgent",
		"HealthMonitoringAgent",
		"PrivacyGuardianAgent",
		"MiningControllerAgent",
		"DeviceGuardianAgent",
		"RobotAssistantAgent",
		"FinancialMonitoringAgent",
		"CodeQualityAgent",
		"GameDeveloperAgent",
		"WorldKnowledgeAgent",
		"UniversalTranslatorAgent",
		"NegotiationAgent",
		"NewsIntelligenceAgent",
		"PoliticalStabilityAgent",
		"SocialMediaAgent",
	}

	registered := 0
	skipped := 0

	for _, name := range desiredOrder {
		factory, ok := availableFactories[name]
		if !ok {
			fmt.Printf("[AgentRegistry] Skipped %s (constructor not exported yet)\n", name)
			skipped++
			continue
		}
		RegisterAgent(factory(bus))
		registered++
	}

	fmt.Printf("[AgentRegistry] Done. Registered=%d Skipped=%d\n", registered, skipped)
}
