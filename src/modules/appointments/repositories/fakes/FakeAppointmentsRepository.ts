import { isEqual } from 'date-fns';
import * as uuid from 'uuid';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

class FakeAppointmentsRepository implements IAppointmentsRepository {
	private appointments: Appointment[] = [];

	public async findAllInDayFromProvider({
		provider_id,
		day,
		month,
		year,
	}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
		const providerAppointmentsInDay = this.appointments.filter(appointment => {
			return (
				appointment.provider_id === provider_id &&
				appointment.date.getDate() === day &&
				appointment.date.getMonth() + 1 === month &&
				appointment.date.getFullYear() === year
			);
		});

		return providerAppointmentsInDay;
	}

	public async findAllInMonthFromProvider({
		provider_id,
		month,
		year,
	}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
		const providerAppointmentsInMonth = this.appointments.filter(appointment => {
			return (
				appointment.provider_id === provider_id &&
				appointment.date.getMonth() + 1 === month &&
				appointment.date.getFullYear() === year
			);
		});

		return providerAppointmentsInMonth;
	}

	public async findByDate(date: Date): Promise<Appointment | undefined> {
		const appointmentFound = this.appointments.find(appointment => isEqual(appointment.date, date));
		return appointmentFound;
	}

	public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
		const appointment = new Appointment();
		Object.assign(appointment, { id: uuid.v4(), date, provider_id, user_id });
		this.appointments.push(appointment);
		return appointment;
	}
}

export default FakeAppointmentsRepository;
