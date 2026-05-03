import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export class FileStateStore<TState> {
  private saveChain: Promise<void> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  public async read(): Promise<TState | null> {
    try {
      const raw = await readFile(this.filePath, "utf-8");
      return JSON.parse(raw) as TState;
    } catch {
      return null;
    }
  }

  public async write(value: TState): Promise<void> {
    this.saveChain = this.saveChain.then(async () => {
      await mkdir(path.dirname(this.filePath), { recursive: true });
      await writeFile(this.filePath, JSON.stringify(value, null, 2), "utf-8");
    });

    await this.saveChain;
  }
}
