import express, { Request, Response, Router, RequestHandler } from 'express';
import { authService } from '../services/authService.js';
import { passwordService } from '../services/passwordService.js';

const router: Router = express.Router();

interface AuthRequest extends Request {
  body: {
    email: string;
    password: string;
  }
}

const signupHandler: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.signup(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error?.message || 'Unknown error occurred' });
  }
};

const loginHandler: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error?.message || 'Invalid credentials' });
  }
};

const sessionHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const user = await authService.validateToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    res.json({ user });
  } catch (error: any) {
    res.status(401).json({ error: error?.message || 'Authentication failed' });
  }
};

router.post('/signup', signupHandler);
router.post('/login', loginHandler);
router.get('/session', sessionHandler);

router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    await passwordService.requestReset(email);
    res.json({ message: 'If an account exists, a reset link has been sent' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process reset request' });
  }
});

router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    await passwordService.resetPassword(token, password);
    res.json({ message: 'Password successfully reset' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 