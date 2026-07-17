/** Line chart for /aggregates/trend monthly series: [{ month, value }]. */
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TrendLineChart({ data, height = 280, color = '#ff6b4a' }) {
  if (!data || data.length === 0) return <p className="hint">No monthly data for this selection.</p>;

  const chartData = data.map((d) => ({ ...d, monthLabel: MONTH_LABELS[d.month - 1] || d.month }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ left: 4, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3f" />
        <XAxis dataKey="monthLabel" stroke="#8b92a5" fontSize={11} />
        <YAxis stroke="#8b92a5" fontSize={11} />
        <Tooltip
          contentStyle={{ background: '#161922', border: '1px solid #2a2f3f', borderRadius: 6 }}
          labelStyle={{ color: '#e7e9ee' }}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
