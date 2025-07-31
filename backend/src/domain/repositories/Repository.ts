// Interfaz base para todos los repositorios
export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  deleteAll(): Promise<void>;
} 