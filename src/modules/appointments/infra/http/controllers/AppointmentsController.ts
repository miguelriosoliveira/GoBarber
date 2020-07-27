import { parseISO } from 'date-fns';
import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { provider_id, date } = request.body;

		const createAppointment = container.resolve(CreateAppointmentService);

		const parsedDate = parseISO(date);
		const newAppointment = await createAppointment.execute({ provider_id, date: parsedDate });

		return response.json(newAppointment);
	}
}
