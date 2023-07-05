import { useEffect, useMemo, useRef, useState } from 'react';
import { FakeProgress } from './fake-progress';

function usePersistCallback<T extends (...args: any[]) => any>(fn: T) {
  const fnRef = useRef(fn);
  fnRef.current = useMemo(() => fn, [fn]);

  const persistFnRef = useRef((...args: any[]) => {
    return fnRef.current(...args);
  });

  return persistFnRef.current as T;
}

export function useFakeProgress(steps: number[], onFinish?: () => void) {
  const fakeProgress = useMemo(() => new FakeProgress(steps), [steps]);
  const [state, setState] = useState(() => fakeProgress.getState());

  const handleFinish = usePersistCallback(() => {
    onFinish?.();
  });

  useEffect(() => {
    fakeProgress.on('finish', () => handleFinish());
    fakeProgress.on('change', () => setState(fakeProgress.getState()));
    setState(fakeProgress.getState());

    return () => {
      fakeProgress.destroy();
    };
  }, [fakeProgress]);

  return [
    state,
    {
      reset: usePersistCallback(() => fakeProgress.reset(steps)),
      start: usePersistCallback(() => fakeProgress.start()),
      finish: usePersistCallback(() => fakeProgress.finish()),
    },
  ] as const;
}
