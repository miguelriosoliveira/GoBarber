import { getDaysInMonth } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
	provider_id: string;
	month: number;
	year: number;
}

type IResponse = Array<{
	day: number;
	available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabityService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,
	) { }

	public async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {
		const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
			provider_id,
			month,
			year,
		});

		const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

		const eachDayArray = Array.from(
			{
				length: numberOfDaysInMonth,
			},
			(value, index) => index + 1,
		);

		// return [{ day: 1, available: false }];
		const appointmentDays = appointments.map(appointment => appointment.date.getDate());

		return eachDayArray.map(day => ({ day, available: !appointmentDays.includes(day) }));
	}
}
