import { registerUser, loginUser } from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: { message: 'Username and password are required' } });
    }
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: { message: 'Username must be 3–20 characters' } });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: { message: 'Password must be at least 6 characters' } });
    }

    const { user, token } = await registerUser(username, password);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: { message: 'Username and password are required' } });
    }

    const { user, token } = await loginUser(username, password);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
}
