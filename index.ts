import express from 'express';
import path from 'path';
import { initDb } from './db';
import userController from './user/controller/userController';
import authController from './auth/controller/authController';
import { authenticate, authorize } from './authMiddleware';

initDb();

const app: express.Application = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/usr', userController);
app.use('/', authController);

app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/loginPage', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/registerPage', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get(
  '/manageUsersPage',
  authenticate,
  authorize('administrator'),
  (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, 'public', 'manage_users.html'));
  }
);

app.listen(3000, () => {
  console.log('Server listening on port http://localhost:3000');
});
