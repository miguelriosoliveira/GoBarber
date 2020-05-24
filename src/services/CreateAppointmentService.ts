import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
	provider_id: string;
	date: Date;
}

class CreateAppointmentService {
	public async execute({ provider_id, date }: Request): Promise<Appointment> {
		const appointmentsRepository = getCustomRepository(AppointmentsRepository);

		const appointmentDate = startOfHour(date);
		const appointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);

		if (appointmentInSameDate) {
			throw new AppError('This appointment is already booked');
		}

		const newAppointment = appointmentsRepository.create({
			provider_id,
			date: appointmentDate,
		});
		await appointmentsRepository.save(newAppointment);
		return newAppointment;
	}
}

export default CreateAppointmentService;
