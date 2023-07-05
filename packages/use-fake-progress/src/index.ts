import { useEffect, useMemo, useRef, useState } from 'react';

function usePersistCallback<T extends (...args: any[]) => any>(fn: T) {
  const fnRef = useRef(fn);
  fnRef.current = useMemo(() => fn, [fn]);

  const persistFnRef = useRef((...args: any[]) => {
    return fnRef.current(...args);
  });

  return persistFnRef.current as T;
}

function sum(numbers: number[]) {
  return numbers.reduce((previous, num) => previous + num, 0);
}

export function useFakeProgress(steps: number[], onFinish?: () => void) {
  const timeout = 50;
  const runIdRef = useRef(-1);
  const quickFinishIdRef = useRef(-2);
  const runningRef = useRef(false);

  useEffect(() => {
    return () => {
      window.clearTimeout(runIdRef.current);
      window.clearTimeout(quickFinishIdRef.current);
    };
  }, []);

  const [current, setCurrent] = useState(0);
  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  });

  const total = sum(steps);
  const max = total - timeout;
  const step = steps.reduce((previous, _, index) => {
    return current < sum(steps.slice(0, index + 1)) ? previous : previous + 1;
  }, 0);

  const progress = (current / total) * 100;
  const finished = current >= total;

  const run = usePersistCallback(() => {
    runIdRef.current = window.setTimeout(() => {
      const next = Math.min(currentRef.current + timeout, max);
      setCurrent(next);
      if (next > max) {
        runningRef.current = false;
      } else {
        run();
      }
    }, timeout);
  });

  const reset = usePersistCallback(() => {
    window.clearTimeout(runIdRef.current);
    window.clearTimeout(quickFinishIdRef.current);
    runningRef.current = false;
    setCurrent(0);
  });

  const start = usePersistCallback(() => {
    if (runningRef.current) {
      return;
    }
    runningRef.current = true;
    currentRef.current = 0;
    run();
  });

  const stopQuickFinish = usePersistCallback(() => {
    window.clearTimeout(quickFinishIdRef.current);
    onFinish?.();
    runningRef.current = false;
  });

  const quickFinish = usePersistCallback(() => {
    if (step <= steps.length) {
      const next = Math.min(sum(steps.slice(0, step + 1)), total);
      setCurrent(next);
      if (next < total) {
        quickFinishIdRef.current = window.setTimeout(() => {
          quickFinish();
        }, timeout);
      } else {
        stopQuickFinish();
      }
    } else {
      stopQuickFinish();
    }
  });

  const finish = usePersistCallback(() => {
    window.clearTimeout(runIdRef.current);
    quickFinish();
  });

  return [
    { step, progress, finished },
    { reset, start, finish },
  ] as const;
}
