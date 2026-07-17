import { useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getAggregateAccidents } from '../api/client';
import FilterPanel from '../components/FilterPanel';
import AggregateBarChart from '../components/AggregateBarChart';
import DataTable from '../components/DataTable';
import StatusBanner from '../components/StatusBanner';

const DEFAULT_FILTERS = {
  state: '', level: 'district', year: '', category: '', sort: 'count_desc', limit: 10,
};

export default function Rankings() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const result = useAsync(() => getAggregateAccidents({
    level: filters.level, state: filters.state || undefined, year: filters.year,
    category: filters.category, sort: filters.sort, limit: filters.limit,
    bicycle: filters.bicycle || undefined, pedestrian: filters.pedestrian || undefined,
    car: filters.car || undefined, motorcycle: filters.motorcycle || undefined,
    truck: filters.truck || undefined,
  }), [filters]);

  return (
    <div>
      <div className="page-header">
        <h2>Rankings</h2>
        <p>Top or bottom regions by accident count, for any combination of filters.</p>
      </div>

      <div className="panel">
        <FilterPanel
          value={filters}
          onChange={setFilters}
          fields={['level', 'state', 'year', 'category', 'sort', 'limit', 'flags']}
        />
      </div>

      <div className="panel">
        <StatusBanner loading={result.loading} error={result.error} />
        {!result.loading && !result.error && (
          <>
            <AggregateBarChart data={result.data} />
            <div style={{ marginTop: 16 }}>
              <DataTable
                rows={result.data}
                columns={[
                  { key: 'region_ags', label: 'AGS' },
                  { key: 'region_name', label: 'Name' },
                  { key: 'count', label: 'Accidents' },
                ]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
