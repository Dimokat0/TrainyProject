import express from 'express';
const router = express.Router();
import userService from '../service/userService';
import userRepository from '../repository/userRepository';

router.get('/', async (req: express.Request, res: express.Response) => {
  const users = await userRepository.getAllUsers();
  res.json(users);
});

router.get('/id', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const user = await userRepository.getUserById(parseInt(id));
  res.json(user);
});

router.get('/roles', async (req: express.Request, res: express.Response) => {
  const roles = await userRepository.getRoles();
  res.json(roles);
});

router.get('/roles/:id', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const role = await userRepository.getRoleById(parseInt(id));
  res.json(role);
});

router.post('/', async (req: express.Request, res: express.Response) => {
  let { username, password, roleId } = req.body;
  if (!roleId) {
    roleId = 1;
  }
  await userService.createUser(username, password, roleId);
  res.send('User created');
});

router.patch('/:id', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { username, password, roleId } = req.body;
  await userRepository.updateUser(parseInt(id), username, password, roleId);
  res.send('User updated');
});

router.delete('/:id', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  await userRepository.deleteUser(parseInt(id));
  res.send('User deleted');
});

export default router;
