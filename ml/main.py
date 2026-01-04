from command_recommender import CommandRecommender
from mesh_integration import MeshIntegration

import json

# Initialize components
recommender = CommandRecommender()
mesh = MeshIntegration(nodes=["node1.local", "node2.local"])

# Example: simulate receiving logs from TS orchestrator
sample_logs = """
[ERROR] build failed at step compile
[WARN] unused variable in app.ts
"""
proposal = recommender.generate_proposal(sample_logs)
remote_suggestion = mesh.suggest_remote_execution(proposal["command"])

print("ML Proposal:", json.dumps(proposal, indent=2))
print("Remote Node Suggestion:", json.dumps(remote_suggestion, indent=2))
