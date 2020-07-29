import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
	it('should be able to create an appointment', async () => {
		const fakeAppointmentsRepository = new FakeAppointmentsRepository();
		const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

		const date = new Date();
		const provider_id = '123456';
		const appointment = await createAppointment.execute({
			date,
			provider_id,
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.date).toStrictEqual(startOfHour(date));
		expect(appointment.provider_id).toBe(provider_id);
	});

	it('should not allow to create two appointments at same time', async () => {
		const fakeAppointmentsRepository = new FakeAppointmentsRepository();
		const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

		const appointmentDate = new Date();
		await createAppointment.execute({
			date: appointmentDate,
			provider_id: '123',
		});

		await expect(
			createAppointment.execute({
				date: appointmentDate,
				provider_id: '456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
