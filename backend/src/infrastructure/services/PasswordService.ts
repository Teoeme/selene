import bcrypt from 'bcrypt';
import { PasswordService } from '../../domain/services/PasswordService';

export class BcryptPasswordService implements PasswordService {
  private readonly saltRounds = 12;

  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error('Failed to compare password');
    }
  }
} 