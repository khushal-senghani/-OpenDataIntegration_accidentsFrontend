/**
 * Renders `rows` as a table. `columns` is [{ key, label, render? }];
 * if omitted, columns are inferred from the first row's keys.
 */
export default function DataTable({ rows, columns, emptyText = 'No data' }) {
  if (!rows || rows.length === 0) return <p className="hint">{emptyText}</p>;
  const cols = columns || Object.keys(rows[0]).map((key) => ({ key, label: key }));

  return (
    <table className="data-table">
      <thead>
        <tr>{cols.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id ?? row.accident_id ?? row.ags ?? i}>
            {cols.map((c) => (
              <td key={c.key}>{c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '—')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
