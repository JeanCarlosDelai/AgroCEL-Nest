// authentication.middleware.ts
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify, Secret } from 'jsonwebtoken';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException('JWT token está faltando');
    }

    const [, token] = authHeader.split(' ');

    try {
      const decodedToken = verify(token, process.env.JWT_SECRET as Secret);

      const { sub } = decodedToken as ITokenPayload;

      req.user = {
        id: sub,
      };

      return next();
    } catch {
      throw new BadRequestException(authHeader);
    }
  }
}
