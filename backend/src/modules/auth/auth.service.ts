import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../config/db';
import { generateAccessToken, generateRefreshToken, TokenPayload, verifyRefreshToken } from '../../config/security';
import { RegisterInput, LoginInput } from './auth.validator';

const SALT_ROUNDS = 10;

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password_hash: passwordHash,
        name: data.name,
      },
      include: { role: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role.name);

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
      ...tokens,
    };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { role: true },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password_hash);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role.name);

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
      ...tokens,
    };
  }

  async logout(userId: number, refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    await prisma.refreshToken.updateMany({
      where: {
        user_id: userId,
        token_hash: tokenHash,
        revoked_at: null,
      },
      data: {
        revoked_at: new Date(),
      },
    });
  }

  async refresh(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          user_id: parseInt(payload.userId),
          token_hash: tokenHash,
          revoked_at: null,
          expires_at: {
            gt: new Date(),
          },
        },
      });

      if (!storedToken) {
        throw new Error('Invalid refresh token');
      }

      // Revoke old token
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked_at: new Date() },
      });

      // Generate new tokens
      const user = await prisma.user.findUnique({
        where: { id: parseInt(payload.userId) },
        include: { role: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role.name);

      return {
        user: {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role.name,
        },
        ...tokens,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  private async generateTokens(userId: number, email: string, role: string) {
    const payload: TokenPayload = {
      userId: userId.toString(),
      email,
      role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token hash
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.refreshToken.create({
      data: {
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
