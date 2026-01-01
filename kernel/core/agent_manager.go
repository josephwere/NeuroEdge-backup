package core

import (
	"fmt"
	"sync"

	"kernel/agents"
)

// AgentInterface defines the base functions all agents must implement
type AgentInterface interface {
	Name() string
	Initialize() error
	HandleEvent(event string, payload map[string]interface{}) error
}

// Global agent registry
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
		fmt.Printf("[AgentManager] Agent %s already registered\n", name)
		return
	}

	AgentRegistry.agents[name] = agent
	err := agent.Initialize()
	if err != nil {
		fmt.Printf("[AgentManager] Failed to initialize %s: %v\n", name, err)
	} else {
		fmt.Printf("[AgentManager] Registered agent: %s\n", name)
	}
}

// GetAgent returns an agent by name
func GetAgent(name string) (AgentInterface, bool) {
	AgentRegistry.RLock()
	defer AgentRegistry.RUnlock()
	agent, exists := AgentRegistry.agents[name]
	return agent, exists
}

// InitializeAllAgents registers all 71+ agents
func InitializeAllAgents() {
	RegisterAgent(&agents.GlobalMeshAgent{})
	RegisterAgent(&agents.AntiTheftSentinelAgent{})
	RegisterAgent(&agents.GovernmentAdvisorAgent{})
	RegisterAgent(&agents.MedicalDoctorAgent{})
	RegisterAgent(&agents.LawEnforcementAgent{})
	RegisterAgent(&agents.CybersecurityShieldAgent{})
	RegisterAgent(&agents.EducationMentorAgent{})
	RegisterAgent(&agents.BusinessConsultantAgent{})
	RegisterAgent(&agents.CodingPartnerAgent{})
	RegisterAgent(&agents.IdentityAgent{})
	RegisterAgent(&agents.WDCWalletAgent{})
	RegisterAgent(&agents.NeuroChainValidatorAgent{})
	RegisterAgent(&agents.EmergencyResponseAgent{})
	RegisterAgent(&agents.DroneControllerAgent{})
	RegisterAgent(&agents.SmartCityAgent{})
	RegisterAgent(&agents.BankingAgent{})
	RegisterAgent(&agents.TaxAgent{})
	RegisterAgent(&agents.AgricultureAgent{})
	RegisterAgent(&agents.LogisticsAgent{})
	RegisterAgent(&agents.BorderControlAgent{})
	RegisterAgent(&agents.ClimateAgent{})
	RegisterAgent(&agents.ManufacturingAgent{})
	RegisterAgent(&agents.LawyerAgent{})
	RegisterAgent(&agents.JobRecruiterAgent{})
	RegisterAgent(&agents.TherapistAgent{})
	RegisterAgent(&agents.ChildTutorAgent{})
	RegisterAgent(&agents.ResearchAgent{})
	RegisterAgent(&agents.MathSolverAgent{})
	RegisterAgent(&agents.ScienceAgent{})
	RegisterAgent(&agents.MedicalImagingAgent{})
	RegisterAgent(&agents.HospitalWorkflowAgent{})
	RegisterAgent(&agents.PoliceCommandAgent{})
	RegisterAgent(&agents.FraudDetectionAgent{})
	RegisterAgent(&agents.DeviceFingerprintAgent{})
	RegisterAgent(&agents.WDCTraderAgent{})
	RegisterAgent(&agents.DeveloperOpsAgent{})
	RegisterAgent(&agents.APIGeneratorAgent{})
	RegisterAgent(&agents.AppBuilderAgent{})
	RegisterAgent(&agents.MemoryAgent{})
	RegisterAgent(&agents.PlanningAgent{})
	RegisterAgent(&agents.DigitalTwinAgent{})
	RegisterAgent(&agents.SatelliteLinkAgent{})
	RegisterAgent(&agents.RouterMeshAgent{})
	RegisterAgent(&agents.TelecomAgent{})
	RegisterAgent(&agents.HardwareNodeAgent{})
	RegisterAgent(&agents.OfflineIdentityAgent{})
	RegisterAgent(&agents.DecentralizedAIAgent{})
	RegisterAgent(&agents.HomeAssistantAgent{})
	RegisterAgent(&agents.VehicleControllerAgent{})
	RegisterAgent(&agents.CityInfrastructureAgent{})
	RegisterAgent(&agents.FraudSentinelAgent{})
	RegisterAgent(&agents.TravelAgent{})
	RegisterAgent(&agents.VotingAgent{})
	RegisterAgent(&agents.VerificationOfficerAgent{})
	RegisterAgent(&agents.PersonalWDCAssistantAgent{})
	RegisterAgent(&agents.ProductivityAgent{})
	RegisterAgent(&agents.HealthMonitoringAgent{})
	RegisterAgent(&agents.PrivacyGuardianAgent{})
	RegisterAgent(&agents.MiningControllerAgent{})
	RegisterAgent(&agents.DeviceGuardianAgent{})
	RegisterAgent(&agents.RobotAssistantAgent{})
	RegisterAgent(&agents.FinancialMonitoringAgent{})
	RegisterAgent(&agents.CodeQualityAgent{})
	RegisterAgent(&agents.GameDeveloperAgent{})
	RegisterAgent(&agents.WorldKnowledgeAgent{})
	RegisterAgent(&agents.UniversalTranslatorAgent{})
	RegisterAgent(&agents.NegotiationAgent{})
	RegisterAgent(&agents.NewsIntelligenceAgent{})
	RegisterAgent(&agents.PoliticalStabilityAgent{})
	RegisterAgent(&agents.SocialMediaAgent{})
}
