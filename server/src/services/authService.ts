import { prisma } from '../lib/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export const authService = {
  async signup(email: string, password: string): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  },

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
      };
    } catch {
      return null;
    }
  }
}; 