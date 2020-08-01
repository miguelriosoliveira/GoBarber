import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';

interface ITokenPayload {
	iat: number;
	exp: number;
	sub: string;
}

function ensureAuthenticated(request: Request, _: Response, next: NextFunction): void {
	const { authorization } = request.headers;

	if (!authorization) {
		throw new AppError('JWT token is missing', 401);
	}

	const [, token] = authorization.split(' ');

	try {
		const decoded = verify(token, authConfig.jwt.secret);

		const { sub } = decoded as ITokenPayload;
		request.user = { id: sub };

		return next();
	} catch {
		throw new AppError('Invalid JWT token', 401);
	}
}

export default ensureAuthenticated;
