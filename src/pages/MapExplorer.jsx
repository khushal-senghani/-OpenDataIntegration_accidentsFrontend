import { useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getAccidents, getRegions } from '../api/client';
import FilterPanel from '../components/FilterPanel';
import AccidentMap from '../components/AccidentMap';
import StatusBanner from '../components/StatusBanner';
import { formatNumber } from '../utils/format';

const DEFAULT_FILTERS = { state: '', district: '', year: '', category: '', limit: 300 };

export default function MapExplorer() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [applied, setApplied] = useState(null); // only set when "Load" is pressed

  const districts = useAsync(
    () => getRegions({ level: 'district', parent: filters.state }),
    [filters.state],
    !!filters.state
  );

  const result = useAsync(
    () => getAccidents({
      state: applied.state, district: applied.district, year: applied.year,
      category: applied.category, limit: applied.limit,
      bicycle: applied.bicycle || undefined, pedestrian: applied.pedestrian || undefined,
      car: applied.car || undefined, motorcycle: applied.motorcycle || undefined,
      truck: applied.truck || undefined,
    }),
    [applied],
    !!applied
  );

  return (
    <div>
      <div className="page-header">
        <h2>Map Explorer</h2>
        <p>Plots individual accident points. Narrow the filters before loading — the API caps any single request at 1000 rows.</p>
      </div>

      <div className="panel">
        <FilterPanel
          value={filters}
          onChange={setFilters}
          fields={['state', 'district', 'year', 'category', 'flags', 'limit']}
          districts={districts.data || []}
          onSubmit={() => setApplied(filters)}
          submitLabel="Load accidents"
        />
      </div>

      {!applied && <StatusBanner info="Set your filters and click “Load accidents” to fetch and plot points." />}
      <StatusBanner loading={result.loading} error={result.error} />

      {result.data && (
        <>
          <p className="hint" style={{ marginBottom: 10 }}>
            Showing {formatNumber(result.data.data.length)} of {formatNumber(result.data.total)} matching accidents.
            {result.data.total > result.data.data.length && ' Narrow your filters to see the rest.'}
          </p>
          <AccidentMap accidents={result.data.data} />
        </>
      )}
    </div>
  );
}
