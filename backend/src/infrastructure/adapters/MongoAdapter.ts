import mongoose from 'mongoose';

// Adaptador genérico para MongoDB
export interface MongoDocument {
  id: string;
  [key: string]: any;
}

export interface MongoAdapter<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  find(filter?: any): Promise<T[]>;
}

export abstract class BaseMongoAdapter<T> implements MongoAdapter<T> {
  protected model: mongoose.Model<any>;

  constructor(model: mongoose.Model<any>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    try {
      const document = await this.model.findById(id);
      if (!document) {
        return null;
      }
      return this.toDomain(document);
    } catch (error) {
      console.error(`Error finding by id:`, error);
      throw new Error(`Error finding by id`);
    }
  }

  async save(entity: T): Promise<void> {
    try {
      const document = this.toDocument(entity);
      await this.model.findByIdAndUpdate(
        this.getId(entity),
        document,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error(`Error saving:`, error);
      throw new Error(`Error saving`);
    }
  }

  async find(filter?: any): Promise<T[]> {
    try {
      const documents = await this.model.find(filter);
      return documents.map(document => this.toDomain(document));
    } catch (error) {
      console.error(`Error finding:`, error);
      throw new Error(`Error finding`);
    }
  }

  protected abstract toDomain(document: any): T;
  protected abstract toDocument(entity: T): any;
  protected abstract getId(entity: T): string;
} 