import { useState } from 'react';

export function useFakeProgress() {
  const [progress] = useState(0);
  return [progress];
}
