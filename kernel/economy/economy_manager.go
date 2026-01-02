package economy

import (
	"kernel/economy/ledger"
	"kernel/economy/rewards"
	"kernel/economy/staking"
)

type EconomyManager struct {
	Ledger  *ledger.Ledger
	Rewards *rewards.RewardEngine
	Staking *staking.StakeManager
}

func NewEconomyManager() *EconomyManager {
	return &EconomyManager{
		Ledger:  ledger.NewLedger(),
		Rewards: rewards.NewRewardEngine(),
		Staking: staking.NewStakeManager(),
	}
}
