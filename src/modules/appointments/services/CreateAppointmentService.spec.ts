import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		fakeNotificationsRepository = new FakeNotificationsRepository();
		createAppointment = new CreateAppointmentService(
			fakeAppointmentsRepository,
			fakeNotificationsRepository,
		);
	});

	it('should be able to create an appointment', async () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(9);
		const provider_id = 'provider_id';
		const user_id = 'user_id';
		const appointment = await createAppointment.execute({
			date: tomorrow,
			provider_id,
			user_id,
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.date).toStrictEqual(startOfHour(tomorrow));
		expect(appointment.provider_id).toBe(provider_id);
	});

	it('should not allow to create two appointments at same time', async () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(9);

		await createAppointment.execute({
			date: tomorrow,
			provider_id: 'provider_id',
			user_id: 'user_id',
		});

		await expect(
			createAppointment.execute({
				date: tomorrow,
				provider_id: 'provider_id_2',
				user_id: 'user_id_2',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not allow to create an appointment on a past date', async () => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);

		await expect(
			createAppointment.execute({
				date: yesterday,
				provider_id: 'provider_id_2',
				user_id: 'user_id_2',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not allow to create an appointment with same user as provider', async () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		await expect(
			createAppointment.execute({
				date: tomorrow,
				provider_id: 'provider_id',
				user_id: 'provider_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not allow to create an appointment before 8am or after 5pm', async () => {
		const tomorrow7am = new Date();
		tomorrow7am.setDate(tomorrow7am.getDate() + 1);
		tomorrow7am.setHours(7);

		await expect(
			createAppointment.execute({
				date: tomorrow7am,
				provider_id: 'provider_id',
				user_id: 'user_id',
			}),
		).rejects.toBeInstanceOf(AppError);

		const tomorrow6pm = new Date();
		tomorrow6pm.setDate(tomorrow6pm.getDate() + 1);
		tomorrow6pm.setHours(7);

		await expect(
			createAppointment.execute({
				date: tomorrow6pm,
				provider_id: 'provider_id',
				user_id: 'user_id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
