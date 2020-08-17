import { startOfHour, isBefore } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
	provider_id: string;
	user_id: string;
	date: Date;
}

@injectable()
class CreateAppointmentService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,
	) {}

	public async execute({ provider_id, user_id, date }: IRequest): Promise<Appointment> {
		const appointmentDate = startOfHour(date);

		if (provider_id === user_id) {
			throw new AppError("You can't create an appointment for yourself");
		}

		if (isBefore(appointmentDate, startOfHour(Date.now()))) {
			throw new AppError("You can't create an appointment on a past date");
		}

		const startHour = 8;
		const endHour = 17;
		const appointmentHour = appointmentDate.getHours();

		if (appointmentHour < startHour || appointmentHour > endHour) {
			throw new AppError('You can only create a appointments between 8am and 5pm');
		}

		const appointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);
		if (appointmentInSameDate) {
			throw new AppError('This appointment is already booked');
		}

		const newAppointment = await this.appointmentsRepository.create({
			provider_id,
			user_id,
			date: appointmentDate,
		});

		return newAppointment;
	}
}

export default CreateAppointmentService;
