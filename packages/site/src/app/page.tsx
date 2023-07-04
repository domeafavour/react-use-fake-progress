'use client';

import { useFakeProgress } from 'use-fake-progress';

export default function Home() {
  const [progress] = useFakeProgress();
  return (
    <main>
      <h1>{progress}</h1>
    </main>
  );
}
