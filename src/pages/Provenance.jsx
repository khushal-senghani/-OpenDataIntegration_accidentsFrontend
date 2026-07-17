import { useMemo, useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getSources, getIndicators } from '../api/client';
import DataTable from '../components/DataTable';
import StatusBanner from '../components/StatusBanner';

export default function Provenance() {
  const sources = useAsync(() => getSources(), []);
  const indicators = useAsync(() => getIndicators(), []);
  const [search, setSearch] = useState('');

  const filteredIndicators = useMemo(() => {
    if (!indicators.data) return null;
    const q = search.trim().toLowerCase();
    if (!q) return indicators.data;
    return indicators.data.filter(
      (i) => i.code.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)
    );
  }, [indicators.data, search]);

  return (
    <div>
      <div className="page-header">
        <h2>Provenance</h2>
        <p>What was imported, from where, under which licence, and when.</p>
      </div>

      <div className="panel">
        <h3>Import runs</h3>
        <StatusBanner loading={sources.loading} error={sources.error} />
        {sources.data && (
          <DataTable
            rows={sources.data}
            columns={[
              { key: 'source_name', label: 'Source' },
              {
                key: 'source_mode', label: 'Mode',
                render: (v) => <span className={`mode-badge mode-${v}`}>{v || '—'}</span>,
              },
              { key: 'source_file', label: 'File' },
              { key: 'license', label: 'Licence' },
              {
                key: 'retrieved_at', label: 'Retrieved',
                render: (v) => v ? new Date(v).toLocaleDateString() : '—',
              },
              { key: 'records_imported', label: 'Rows' },
              { key: 'notes', label: 'Notes' },
            ]}
          />
        )}
      </div>

      <div className="panel">
        <h3>Indicator catalogue ({filteredIndicators?.length ?? '…'} of {indicators.data?.length ?? '…'})</h3>
        <div className="field" style={{ marginBottom: 12, maxWidth: 280 }}>
          <label>Search code / name</label>
          <input type="text" placeholder="e.g. fahrunfall" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <StatusBanner loading={indicators.loading} error={indicators.error} />
        {filteredIndicators && (
          <DataTable
            rows={filteredIndicators.slice(0, 100)}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'name', label: 'Name' },
              { key: 'unit', label: 'Unit' },
              { key: 'source_system', label: 'Source system' },
            ]}
          />
        )}
        {filteredIndicators && filteredIndicators.length > 100 && (
          <p className="hint">Showing first 100 of {filteredIndicators.length} matches — narrow your search to see more.</p>
        )}
      </div>
    </div>
  );
}
