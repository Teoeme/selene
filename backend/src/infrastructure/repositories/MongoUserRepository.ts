import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Company } from '../../domain/entities/Company';
import { UserRole } from '../../domain/value-objects/UserRole';
import { UserModel } from '../database/schemas/UserSchema';

export class MongoUserRepository implements UserRepository {
  private toDomain(document: any): User {
    // Crear Company desde el populate o desde companyId
    const company = document.companyId && typeof document.companyId === 'object'
      ? new Company(
          document.companyId._id,
          document.companyId.name,
          document.companyId.description,
          new Date(document.companyId.createdAt),
          new Date(document.companyId.updatedAt)
        )
      : new Company(document.companyId, '', '', new Date(), new Date());

    return new User(
      document._id,
      document.email,
      document.name,
      document.password || '', 
      document.role as UserRole,
      company,
      new Date(document.createdAt),
      new Date(document.updatedAt)
    );
  }

  private toDocument(user: User): any {
    return {
      _id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
      password: user.getPassword(),
      role: user.getRole(),
      companyId: user.getCompany().getId(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt()
    };
  }

  async findById(id: string): Promise<User | null> {
    try {
      const document = await UserModel.findById(id).populate('companyId');
      if (!document) {
        return null;
      }
      const user = this.toDomain(document);
      return user;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw new Error('Error finding user by id');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const document = await UserModel.findOne({ email })
        .select('+password') 
        .populate('companyId');
      if (!document) {
        return null;
      }
      return this.toDomain(document);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Error finding user by email');
    }
  }

  async save(user: User): Promise<void> {
    try {
      const document = this.toDocument(user);
      await UserModel.findByIdAndUpdate(
        user.getId(),
        document,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Error saving user');
    }
  }

  async deleteAll(): Promise<void> {
    await UserModel.deleteMany({});
  }
} 