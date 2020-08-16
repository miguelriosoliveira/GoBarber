import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
	});

	it('should be able to create an appointment', async () => {
		const date = new Date();
		const provider_id = 'provider_id';
		const user_id = 'user_id';
		const appointment = await createAppointment.execute({
			date,
			provider_id,
			user_id,
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.date).toStrictEqual(startOfHour(date));
		expect(appointment.provider_id).toBe(provider_id);
	});

	it('should not allow to create two appointments at same time', async () => {
		const appointmentDate = new Date();
		await createAppointment.execute({
			date: appointmentDate,
			provider_id: 'provider_id',
			user_id: 'user_id',
		});

		await expect(
			createAppointment.execute({
				date: appointmentDate,
				provider_id: 'provider_id_2',
				user_id: 'user_id_2',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
