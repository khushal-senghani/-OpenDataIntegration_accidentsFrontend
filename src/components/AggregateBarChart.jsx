/** Bar chart for /aggregates/accidents-shaped rows: [{ region_name, count }]. */
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export default function AggregateBarChart({ data, height = 320, color = '#ff6b4a' }) {
  if (!data || data.length === 0) return <p className="hint">No data to chart.</p>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3f" horizontal={false} />
        <XAxis type="number" stroke="#8b92a5" fontSize={11} />
        <YAxis
          type="category" dataKey="region_name" stroke="#8b92a5" fontSize={11}
          width={140} tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: '#161922', border: '1px solid #2a2f3f', borderRadius: 6 }}
          labelStyle={{ color: '#e7e9ee' }}
        />
        <Bar dataKey="count" fill={color} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
