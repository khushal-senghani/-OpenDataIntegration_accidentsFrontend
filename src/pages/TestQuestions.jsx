import { useAsync } from '../hooks/useAsync';
import { getTestQuestions } from '../api/client';
import QuestionCard from '../components/QuestionCard';
import StatusBanner from '../components/StatusBanner';

// Matches the task description's own categories, in the same order.
const GROUPS = [
  {
    title: 'Mandatory questions',
    ids: ['earliest-year', 'saxony-2023', 'nrw-earliest', 'mv-earliest', 'berlin-pedestrian-2023'],
  },
  {
    title: 'Cross-source questions (need ≥2 datasets)',
    ids: ['cross-source-rate-saxony', 'cross-source-bicycle-rate'],
  },
  {
    title: 'Additional questions (encouraged, not mandatory)',
    ids: ['top5-fatal-2023', 'dresden-bicycle-2023', 'zero-accidents-sh-2021'],
  },
];

export default function TestQuestions() {
  const result = useAsync(() => getTestQuestions(), []);

  const byId = (id) => result.data?.find((q) => q.id === id);

  return (
    <div>
      <div className="page-header">
        <h2>Test Questions</h2>
        <p>
          Every answer below is computed live from the database by <code>GET /metadata/test-questions</code> —
          nothing here is hand-typed. Re-run it any time to reproduce the same numbers from stored data.
        </p>
      </div>

      <StatusBanner loading={result.loading} error={result.error} />

      {result.data && GROUPS.map((group) => (
        <div key={group.title} style={{ marginBottom: 28 }}>
          <h3 className="group-title">{group.title}</h3>
          {group.ids.map((id) => {
            const item = byId(id);
            return item ? <QuestionCard key={id} item={item} /> : null;
          })}
        </div>
      ))}
    </div>
  );
}
