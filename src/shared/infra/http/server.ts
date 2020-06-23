import 'reflect-metadata';
import 'express-async-errors';

import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';
import routes from '@shared/infra/http/routes';

import uploadConfig from '@config/upload';

import '@shared/infra/typeorm';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);
app.use((err: Error, _request: Request, response: Response, _: NextFunction) => {
	if (err instanceof AppError) {
		return response.status(err.statusCode).json({ status: 'error', message: err.message });
	}

	// eslint-disable-next-line no-console
	console.error(err);

	return response.status(500).json({ status: 'error', messege: 'Internal Server Error' });
});

// eslint-disable-next-line no-console
app.listen(3333, () => console.log('🚀 Server started on port 3333!'));
