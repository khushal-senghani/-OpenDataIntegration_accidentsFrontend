import { useMemo, useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import {
  getAggregateAccidents, getEarliestYear, getRegions, getIndicators, getSources, getTrend,
} from '../api/client';
import KpiCard from '../components/KpiCard';
import AggregateBarChart from '../components/AggregateBarChart';
import TrendLineChart from '../components/TrendLineChart';
import StatusBanner from '../components/StatusBanner';
import { formatNumber } from '../utils/format';

export default function Dashboard() {
  const [stateYear, setStateYear] = useState('');
  const [trendYear, setTrendYear] = useState('');
  const [trendIndicator, setTrendIndicator] = useState('');

  const totals = useAsync(() => getAggregateAccidents({}), []);
  const span = useAsync(() => getEarliestYear({}), []);
  const districts = useAsync(() => getRegions({ level: 'district' }), []);
  const indicators = useAsync(() => getIndicators(), []);
  const sources = useAsync(() => getSources(), []);

  const byState = useAsync(
    () => getAggregateAccidents({ level: 'state', year: stateYear }),
    [stateYear]
  );

  // Curated shortlist: national totals across all accident types/locations,
  // one row per injury severity. Built from whatever the backend actually
  // returned instead of guessing exact slugs. Grand total sorts first so
  // it's the sensible default selection.
  const trendOptions = useMemo(() => {
    if (!indicators.data) return [];
    return indicators.data
      .filter((i) => i.code.startsWith('monthly_insgesamt_insgesamt_'))
      .map((i) => ({ code: i.code, label: i.name }))
      .sort((a, b) => {
        const aTotal = a.code.includes('_insgesamt_unfalle');
        const bTotal = b.code.includes('_insgesamt_unfalle');
        if (aTotal !== bTotal) return aTotal ? -1 : 1;
        return a.label.localeCompare(b.label);
      });
  }, [indicators.data]);

  const activeIndicator = trendIndicator || trendOptions[0]?.code;
  const trend = useAsync(
    () => getTrend({ indicator: activeIndicator, year: trendYear }),
    [activeIndicator, trendYear],
    !!activeIndicator && !!trendYear
  );

  const totalAccidents = totals.data?.[0]?.count;
  const lastImport = sources.data?.[0];

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of everything currently loaded into the database.</p>
      </div>

      <div className="kpi-grid">
        <KpiCard label="Total accidents stored" value={formatNumber(totalAccidents)} />
        <KpiCard
          label="Data span"
          value={span.data ? `${span.data.earliest_year ?? '—'}–${span.data.latest_year ?? '—'}` : '—'}
        />
        <KpiCard label="Districts in reference" value={formatNumber(districts.data?.length)} sub="official Kreis-level units" />
        <KpiCard label="Indicators catalogued" value={formatNumber(indicators.data?.length)} sub="GENESIS + Regionalstatistik" />
        <KpiCard
          label="Last import"
          value={lastImport ? new Date(lastImport.imported_at).toLocaleDateString() : '—'}
          sub={lastImport?.source_name}
        />
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>Accidents by state</h3>
          <div className="filter-row" style={{ marginBottom: 12 }}>
            <div className="field">
              <label>Year</label>
              <input
                type="number" placeholder="All years" value={stateYear}
                onChange={(e) => setStateYear(e.target.value)}
              />
            </div>
          </div>
          <StatusBanner loading={byState.loading} error={byState.error} />
          {!byState.loading && !byState.error && <AggregateBarChart data={byState.data} />}
        </div>

        <div className="panel">
          <h3>National monthly trend</h3>
          <div className="filter-row" style={{ marginBottom: 12 }}>
            <div className="field" style={{ minWidth: 220 }}>
              <label>Indicator</label>
              <select value={activeIndicator || ''} onChange={(e) => setTrendIndicator(e.target.value)}>
                {trendOptions.map((o) => (
                  <option key={o.code} value={o.code}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Year</label>
              <input
                type="number" placeholder="e.g. 2025" value={trendYear}
                onChange={(e) => setTrendYear(e.target.value)}
              />
            </div>
          </div>
          {!trendYear && <StatusBanner info="Enter a year to load the monthly series." />}
          <StatusBanner loading={trend.loading} error={trend.error} />
          {trend.data && (
            <>
              <TrendLineChart data={trend.data.monthly} />
              <p className="hint">
                Total: {formatNumber(trend.data.total)}
                {trend.data.year_over_year_change_percent !== null && (
                  <> · YoY change: {trend.data.year_over_year_change_percent.toFixed(1)}%</>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
