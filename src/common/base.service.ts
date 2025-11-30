export abstract class BaseService<T extends { id: string }> {
  protected items = new Map<string, T>();

  getAll(): T[] {
    return Array.from(this.items.values());
  }

  getById(id: string): T | undefined {
    return this.items.get(id);
  }

  protected generateId(): string {
    return crypto.randomUUID();
  }
}
