import { UserRepository } from '../../../src/domain/repositories/UserRepository';
import { User } from '../../../src/domain/entities/User';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.getId() === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.getEmail() === email) || null;
  }

  async save(user: User): Promise<void> {
    const index = this.users.findIndex(u => u.getId() === user.getId());
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
  }

  async deleteAll(): Promise<void> {
    this.users = [];
  }

  givenExistingUsers(...users: User[]): void {
    this.users = users;
  }
}
