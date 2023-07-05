function sum(numbers: number[]) {
  return numbers.reduce((previous, num) => previous + num, 0);
}

type ListenerType = 'change' | 'finish';

export type FakeProgressState = {
  step: number;
  progress: number;
  finished: boolean;
};

export class FakeProgress {
  private timeout = 50;
  private runId = -1;
  private quickFinishId = -2;
  private running = false;
  private current = 0;
  private max = 0;
  private total = 0;

  private listeners: Map<ListenerType, Set<() => void>> = new Map();

  constructor(private readonly steps: number[]) {
    this.total = sum(steps);
    this.max = this.total - this.timeout;
  }

  private getTotal() {
    return this.total;
  }

  private setCurrent(current: number) {
    this.current = current;
    this.notifyListeners('change');
  }

  private getProgress() {
    return (this.current / this.getTotal()) * 100;
  }

  private getFinished() {
    return this.current >= this.getTotal();
  }

  private notifyListeners(type: ListenerType) {
    if (!this.listeners.has(type)) {
      return;
    }
    this.listeners.get(type)!.forEach((listener) => listener());
  }

  public getState(): FakeProgressState {
    return {
      finished: this.getFinished(),
      progress: this.getProgress(),
      step: this.getStep(),
    };
  }

  public on(type: ListenerType, listener: () => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
    return () => {
      this.listeners.get(type)!.delete(listener);
    };
  }

  public getStep() {
    return this.steps.reduce((previous, _, index) => {
      return this.current < sum(this.steps.slice(0, index + 1))
        ? previous
        : previous + 1;
    }, 0);
  }

  private run() {
    this.runId = window.setTimeout(() => {
      const next = Math.min(this.current + this.timeout, this.max);
      this.setCurrent(next);
      if (next > this.max) {
        this.running = false;
      } else {
        this.run();
      }
    }, this.timeout);
  }

  public start() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.setCurrent(0);
    this.run();
  }

  private stopQuickFinish() {
    window.clearTimeout(this.quickFinishId);
    this.notifyListeners('finish');
    this.running = false;
  }

  private quickFinish() {
    const step = this.getStep();
    if (step <= this.steps.length) {
      const next = Math.min(
        sum(this.steps.slice(0, step + 1)),
        this.getTotal()
      );
      this.setCurrent(next);
      if (next < this.getTotal()) {
        this.quickFinishId = window.setTimeout(() => {
          this.quickFinish();
        }, this.timeout);
      } else {
        this.stopQuickFinish();
      }
    } else {
      this.stopQuickFinish();
    }
  }

  public finish() {
    window.clearTimeout(this.runId);
    this.quickFinish();
  }

  public reset() {
    this.running = false;
    window.clearTimeout(this.quickFinishId);
    window.clearTimeout(this.runId);
    this.setCurrent(0);
  }

  public destroy() {
    window.clearTimeout(this.runId);
    window.clearTimeout(this.quickFinishId);
    this.listeners.clear();
  }
}
