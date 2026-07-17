/**
 * Renders a row of filter controls and reports changes via onChange(patch).
 * `fields` controls which controls appear so each page only shows what it needs.
 */
import { STATES, CATEGORIES, PARTICIPANT_FLAGS } from '../utils/states';

export default function FilterPanel({ value, onChange, fields, districts = [], onSubmit, submitLabel = 'Apply' }) {
  const set = (key, val) => onChange({ ...value, [key]: val });
  const has = (key) => fields.includes(key);

  return (
    <div className="filter-row">
      {has('state') && (
        <div className="field">
          <label>State</label>
          <select value={value.state || ''} onChange={(e) => set('state', e.target.value)}>
            <option value="">All states</option>
            {STATES.map((s) => <option key={s.ags} value={s.ags}>{s.name}</option>)}
          </select>
        </div>
      )}

      {has('district') && (
        <div className="field">
          <label>District</label>
          <select
            value={value.district || ''}
            onChange={(e) => set('district', e.target.value)}
            disabled={districts.length === 0}
          >
            <option value="">All districts</option>
            {districts.map((d) => <option key={d.ags} value={d.ags}>{d.name}</option>)}
          </select>
        </div>
      )}

      {has('year') && (
        <div className="field">
          <label>Year</label>
          <input
            type="number" placeholder="e.g. 2023" value={value.year || ''}
            onChange={(e) => set('year', e.target.value)}
          />
        </div>
      )}

      {has('category') && (
        <div className="field">
          <label>Severity</label>
          <select value={value.category || ''} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      )}

      {has('limit') && (
        <div className="field">
          <label>Limit</label>
          <input
            type="number" min={1} max={1000} value={value.limit || 200}
            onChange={(e) => set('limit', e.target.value)}
          />
        </div>
      )}

      {has('level') && (
        <div className="field">
          <label>Group by</label>
          <select value={value.level || 'district'} onChange={(e) => set('level', e.target.value)}>
            <option value="state">State</option>
            <option value="district">District</option>
          </select>
        </div>
      )}

      {has('sort') && (
        <div className="field">
          <label>Order</label>
          <select value={value.sort || 'count_desc'} onChange={(e) => set('sort', e.target.value)}>
            <option value="count_desc">Highest first</option>
            <option value="count_asc">Lowest first</option>
          </select>
        </div>
      )}

      {onSubmit && (
        <button className="btn" onClick={onSubmit}>{submitLabel}</button>
      )}

      {has('flags') && (
        <div className="checkbox-row" style={{ width: '100%', marginTop: 6 }}>
          {PARTICIPANT_FLAGS.map((f) => (
            <label key={f.key}>
              <input
                type="checkbox"
                checked={!!value[f.key]}
                onChange={(e) => set(f.key, e.target.checked)}
              />
              {f.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
