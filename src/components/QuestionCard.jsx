/**
 * Renders one question/answer pair from GET /metadata/test-questions.
 * `answer` can be a scalar, a single object, or an array of objects —
 * the detail section adapts to whichever shape came back.
 */
import { useState } from 'react';
import DataTable from './DataTable';

export default function QuestionCard({ item }) {
  const [showDetail, setShowDetail] = useState(false);
  const { question, sources, summary, answer } = item;

  const isArray = Array.isArray(answer);
  const isObject = answer !== null && typeof answer === 'object' && !isArray;
  const hasDetail = isArray ? answer.length > 0 : isObject;

  return (
    <div className="panel question-card">
      <div className="question-sources">
        {sources.map((s) => <span key={s} className="source-pill">{s}</span>)}
      </div>
      <h3 className="question-text">{question}</h3>
      <p className="question-summary">{summary}</p>

      {hasDetail && (
        <>
          <button className="btn secondary btn-sm" onClick={() => setShowDetail((v) => !v)}>
            {showDetail ? 'Hide' : 'Show'} underlying data
          </button>
          {showDetail && (
            <div style={{ marginTop: 12 }}>
              {isArray ? (
                <DataTable rows={answer} />
              ) : (
                <DataTable rows={[answer]} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
