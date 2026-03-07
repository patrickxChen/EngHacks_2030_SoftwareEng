import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { fetchBuildingStats } from "../lib/api";
import type { BuildingStat } from "../types";

export function DashboardPage(): JSX.Element {
  const [stats, setStats] = useState<BuildingStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const run = async (): Promise<void> => {
      try {
        const rows = await fetchBuildingStats();
        if (active) {
          setStats(rows);
        }
      } catch {
        if (active) {
          setStats([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  const chartData = useMemo(
    () =>
      stats.map((row) => ({
        building: row.buildingCode,
        submissions: row.submissionCount,
        likelyTrueRatio: row.submissionCount
          ? Math.round((row.likelyTrueCount / row.submissionCount) * 100)
          : 0,
        testimonials: row.testimonialCount
      })),
    [stats]
  );

  return (
    <section className="page-enter">
      <h2>Dashboard</h2>
      <p className="muted-text">Compare E7 vs E2 vs DC and scan trends by building.</p>
      {loading ? <p className="muted-text">Loading chart data...</p> : null}

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="building" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="submissions" fill="#a4462f" name="Submissions" />
            <Bar dataKey="likelyTrueRatio" fill="#e49d37" name="Likely True %" />
            <Bar dataKey="testimonials" fill="#1e8a8a" name="Testimonials" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
