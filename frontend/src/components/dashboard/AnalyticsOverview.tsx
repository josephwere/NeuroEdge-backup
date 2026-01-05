// frontend/src/components/dashboard/AnalyticsOverview.tsx
import React from "react";
import ExecutionStatsChart from "./ExecutionStatsChart";
import ErrorHeatmap from "./ErrorHeatmap";

interface AnalyticsOverviewProps {
  stats: {
    executedCommands: number;
    successCount: number;
    failureCount: number;
    errorTypes: Record<string, number>;
    approvalLatencyAvg: number; // in seconds
    aiConfidenceAvg: number; // 0-100
    meshNodes?: { node: string; status: string }[];
  };
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ stats }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "1rem" }}>
      <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>📊 Execution Overview</h2>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <ExecutionStatsChart stats={stats} />
        <ErrorHeatmap errorTypes={stats.errorTypes} />
      </div>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ padding: "1rem", background: "#1e1e2f", color: "#fff", borderRadius: "12px", minWidth: "200px" }}>
          <strong>Approval Latency:</strong> {stats.approvalLatencyAvg.toFixed(1)} sec
        </div>

        <div style={{ padding: "1rem", background: "#1e1e2f", color: "#fff", borderRadius: "12px", minWidth: "200px" }}>
          <strong>AI Confidence Avg:</strong> {stats.aiConfidenceAvg.toFixed(1)}%
        </div>

        {stats.meshNodes && stats.meshNodes.length > 0 && (
          <div style={{ padding: "1rem", background: "#1e1e2f", color: "#fff", borderRadius: "12px", minWidth: "200px" }}>
            <strong>Mesh Nodes:</strong>
            <ul style={{ marginTop: "0.5rem" }}>
              {stats.meshNodes.map((n) => (
                <li key={n.node}>
                  {n.node}: {n.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsOverview;
