/**
 * Runs an async function whenever `deps` changes and tracks
 * { data, loading, error } so pages don't repeat this boilerplate.
 * `enabled=false` skips the call entirely (e.g. while a filter is empty).
 */
import { useEffect, useState } from 'react';

export function useAsync(asyncFn, deps, enabled = true) {
  const [state, setState] = useState({ data: null, loading: enabled, error: null });

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    asyncFn()
      .then((data) => { if (active) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (active) setState({ data: null, loading: false, error }); });

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
