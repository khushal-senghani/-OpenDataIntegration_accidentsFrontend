import { useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getZeroAccidents } from '../api/client';
import FilterPanel from '../components/FilterPanel';
import DataTable from '../components/DataTable';
import StatusBanner from '../components/StatusBanner';

export default function ZeroAccidents() {
  const [filters, setFilters] = useState({ state: '', year: '' });

  const result = useAsync(
    () => getZeroAccidents({ state: filters.state || undefined, year: filters.year }),
    [filters],
    !!filters.year
  );

  return (
    <div>
      <div className="page-header">
        <h2>Zero Accidents (Bonus)</h2>
        <p>
          Districts with no recorded accidents in a given year — scoped to district level,
          since that's the only level with a complete official reference list bundled with this project.
        </p>
      </div>

      <div className="panel">
        <FilterPanel value={filters} onChange={setFilters} fields={['state', 'year']} />
      </div>

      <div className="panel">
        {!filters.year && <StatusBanner info="Enter a year to run this query." />}
        <StatusBanner loading={result.loading} error={result.error} />
        {result.data && (
          <>
            <p className="hint" style={{ marginBottom: 10 }}>{result.data.length} district(s) with zero recorded accidents.</p>
            <DataTable
              rows={result.data}
              columns={[
                { key: 'district_ags', label: 'AGS' },
                { key: 'district_name', label: 'District' },
              ]}
              emptyText="No districts matched — every district in this scope has at least one recorded accident."
            />
          </>
        )}
      </div>
    </div>
  );
}
