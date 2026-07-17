import { useState } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useAsync } from '../hooks/useAsync';
import { getRatePer10000 } from '../api/client';
import FilterPanel from '../components/FilterPanel';
import DataTable from '../components/DataTable';
import StatusBanner from '../components/StatusBanner';

const DEFAULT_FILTERS = { state: '14', year: '' };

export default function Rates() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const result = useAsync(
    () => getRatePer10000({ state: filters.state || undefined, year: filters.year || undefined }),
    [filters]
  );

  return (
    <div>
      <div className="page-header">
        <h2>Per-Capita Rates</h2>
        <p>
          Joins Regionalstatistik's published rate per 10,000 inhabitants with this service's
          own Unfallatlas-derived counts — an answer that needs two different source datasets.
        </p>
      </div>

      <div className="panel">
        <FilterPanel value={filters} onChange={setFilters} fields={['state', 'year']} />
      </div>

      <div className="panel">
        <h3>Official rate vs. stored raw count, by district</h3>
        <StatusBanner loading={result.loading} error={result.error} />
        {result.data && result.data.length > 0 && (
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart data={result.data} margin={{ left: 4, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3f" />
              <XAxis dataKey="district_name" stroke="#8b92a5" fontSize={10} angle={-30} textAnchor="end" height={70} />
              <YAxis yAxisId="left" stroke="#ff6b4a" fontSize={11} label={{ value: 'Raw count', angle: -90, position: 'insideLeft', fill: '#8b92a5', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#4dd0c4" fontSize={11} label={{ value: 'Rate /10k', angle: 90, position: 'insideRight', fill: '#8b92a5', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#161922', border: '1px solid #2a2f3f', borderRadius: 6 }} labelStyle={{ color: '#e7e9ee' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="raw_accident_count" name="Raw accident count" fill="#ff6b4a" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" dataKey="official_rate_per_10000" name="Official rate /10k" stroke="#4dd0c4" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {result.data && (
          <div style={{ marginTop: 16 }}>
            <DataTable
              rows={result.data}
              columns={[
                { key: 'district_ags', label: 'AGS' },
                { key: 'district_name', label: 'District' },
                { key: 'official_rate_per_10000', label: 'Official rate /10k' },
                { key: 'raw_accident_count', label: 'Raw count (stored)' },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
