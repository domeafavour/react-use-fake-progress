'use client';

import { Progress } from '@/components/Progress';
import { useFakeProgress } from 'use-fake-progress';

export default function Home() {
  const [{ progress, step }, { reset, start, finish }] = useFakeProgress(
    [2000, 3000, 2500, 3500],
    () => {
      console.log('finish');
    }
  );
  return (
    <main>
      <Progress percent={progress.toFixed(2)} />
      <p>step: {step}</p>
      <hr />
      <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
        <button onClick={reset}>reset</button>
        <button onClick={start}>start</button>
        <button onClick={finish}>finish</button>
      </div>
    </main>
  );
}
