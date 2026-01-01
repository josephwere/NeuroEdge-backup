package engine

import (
    "fmt"
    "neuroedge/kernel/core/cognition"
    "neuroedge/kernel/core/ethics"
    "neuroedge/kernel/core/memory"
    "neuroedge/kernel/core/scheduler"
    "neuroedge/kernel/events"
)

type Engine struct {
    EventBus   *events.EventBus
    Memory     *memory.Memory
    Ethics     *ethics.Ethics
    Cognition  *cognition.Cognition
    Scheduler  *scheduler.Scheduler
}

func NewEngine(eventBus *events.EventBus, mem *memory.Memory, ethics *ethics.Ethics, cog *cognition.Cognition, sched *scheduler.Scheduler) *Engine {
    return &Engine{
        EventBus:  eventBus,
        Memory:    mem,
        Ethics:    ethics,
        Cognition: cog,
        Scheduler: sched,
    }
}

func (e *Engine) Start() {
    fmt.Println("🧠 Core engine starting...")
    // Initialize tasks or periodic processes
    e.Scheduler.ScheduleRecurring("heartbeat", func() {
        fmt.Println("💓 NeuroEdge heartbeat tick")
    }, 5) // every 5 seconds
}
