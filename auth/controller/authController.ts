import express from 'express';
const router = express.Router();
import authService from '../service/authService';

router.post('/register', async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body;
  await authService.registerUser(username, password);
  res.send('Register success');
});

router.post('/login', async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body;
  const result = await authService.loginUser(username, password);
  if (result.success) {
    res.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      userId: result.userId,
    });
  } else {
    res.send(result.message);
  }
});

export default router;
