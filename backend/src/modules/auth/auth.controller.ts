import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { cookieOptions } from '../../config/security';
import { AuthRequest } from '../../middleware/auth.middleware';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      
      res.cookie('refreshToken', result.refreshToken, cookieOptions);
      
      res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      
      res.cookie('refreshToken', result.refreshToken, cookieOptions);
      
      res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      
      if (refreshToken && req.user) {
        await authService.logout(parseInt(req.user.userId), refreshToken);
      }
      
      res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      
      if (!refreshToken) {
        res.status(401).json({ error: 'Refresh token required' });
        return;
      }
      
      const result = await authService.refresh(refreshToken);
      
      res.cookie('refreshToken', result.refreshToken, cookieOptions);
      
      res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    res.json({ user: req.user });
  }
}

export const authController = new AuthController();
