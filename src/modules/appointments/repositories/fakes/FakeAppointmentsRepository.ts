import { uuid } from 'uuidv4';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

class FakeAppointmentsRepository implements IAppointmentsRepository {
	private appointments: Appointment[] = [];

	public async findByDate(date: Date): Promise<Appointment | undefined> {
		const appointmentFound = this.appointments.find(appointment => appointment.date === date);
		return appointmentFound;
	}

	public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
		const appointment = new Appointment();
		Object.assign(appointment, { id: uuid(), date, provider_id });
		this.appointments.push(appointment);
		return appointment;
	}
}

export default FakeAppointmentsRepository;
