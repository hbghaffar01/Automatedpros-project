interface BatchRequest<T> {
  id: number;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
}

class RequestBatcher<T> {
  private queue: BatchRequest<T>[] = [];
  private timer: NodeJS.Timeout | null = null;
  private batchSize: number;
  private batchDelay: number;
  private batchProcessor: (ids: number[]) => Promise<T[]>;

  constructor(
    batchProcessor: (ids: number[]) => Promise<T[]>,
    batchSize = 10,
    batchDelay = 50
  ) {
    this.batchProcessor = batchProcessor;
    this.batchSize = batchSize;
    this.batchDelay = batchDelay;
  }

  async request(id: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ id, resolve, reject });
      this.scheduleBatch();
    });
  }

  private scheduleBatch() {
    if (this.timer) return;

    this.timer = setTimeout(() => {
      this.processBatch();
    }, this.batchDelay);
  }

  private async processBatch() {
    this.timer = null;
    
    const batch = this.queue.splice(0, this.batchSize);
    if (batch.length === 0) return;

    const ids = batch.map(req => req.id);
    
    try {
      const results = await this.batchProcessor(ids);
      
      batch.forEach((req, index) => {
        if (results[index]) {
          req.resolve(results[index]);
        } else {
          req.reject(new Error(`No result for ID ${req.id}`));
        }
      });
    } catch (error) {
      batch.forEach(req => req.reject(error));
    }

    if (this.queue.length > 0) {
      this.scheduleBatch();
    }
  }
}

export const createBatcher = <T>(
  batchProcessor: (ids: number[]) => Promise<T[]>,
  batchSize?: number,
  batchDelay?: number
) => new RequestBatcher<T>(batchProcessor, batchSize, batchDelay);
