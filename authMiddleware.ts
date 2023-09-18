import jwt from 'jsonwebtoken';
import { users } from './models';
import { roles } from './models';
import express from 'express';

interface MyJwtPayload extends jwt.JwtPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload;
    }
  }
}

function authenticate(req: express.Request, res: express.Response, next: express.NextFunction): void | express.Response {
  // Get access token from cookie
  if (!req.headers.cookie) {
    return res.sendStatus(401); // Unauthorized
  }
  const cookies = req.headers.cookie.split('; ');
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.startsWith('accessToken=')
  );
  const accessToken = accessTokenCookie
    ? accessTokenCookie.split('=')[1]
    : null;

  // Verify access token
  if (!accessToken) {
    return res.sendStatus(401); // Unauthorized
  }
  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as MyJwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    return res.sendStatus(403); // Forbidden
  }
}


function authorize(role: string) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.user) {
      return res.sendStatus(401); // Unauthorized
    }
    const userId = req.user.userId;
    const user = await users.findOne({
      where: { id: userId },
      include: roles,
    });
    if (!user) {
      return res.sendStatus(404); // Not Found
    } else {
      if (user.role.name !== role) {
        return res.sendStatus(403); // Forbidden
      }
      next();
    }
  };
}


export { authenticate, authorize };
