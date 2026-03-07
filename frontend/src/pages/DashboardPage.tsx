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
import { buildingStats } from "../data/mockData";

export function DashboardPage(): JSX.Element {
  const chartData = buildingStats.map((row) => ({
    building: row.buildingCode,
    submissions: row.submissionCount,
    likelyTrueRatio: Math.round((row.likelyTrueCount / row.submissionCount) * 100),
    testimonials: row.testimonialCount
  }));

  return (
    <section className="page-enter">
      <h2>Dashboard</h2>
      <p className="muted-text">Compare E7 vs E2 vs DC and scan trends by building.</p>

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
