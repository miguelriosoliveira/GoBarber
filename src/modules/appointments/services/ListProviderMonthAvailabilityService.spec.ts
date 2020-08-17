import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderMonthAvailabityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabityService;

describe('ListProviderMonthAvailability', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderMonthAvailability = new ListProviderMonthAvailabityService(
			fakeAppointmentsRepository,
		);
	});

	it('should be able to list month availability of a provider', async () => {
		// test params

		const provider_id = 'provider_id';
		const user_id = 'user_id';
		const day = 20;
		const month = 5; // may
		const year = 2020;

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(year, month - 1, day).getTime();
		});

		// filling the day with appointments

		const workingHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

		await Promise.all(
			workingHours.map(hour => {
				return fakeAppointmentsRepository.create({
					provider_id,
					user_id,
					date: new Date(year, month - 1, day, hour),
				});
			}),
		);

		// getting provider's availability

		const availability = await listProviderMonthAvailability.execute({ provider_id, month, year });

		// assertions

		expect(availability).toStrictEqual(
			expect.arrayContaining([
				{ day: 19, available: false }, // everyday before today is automatically not available
				{ day: 20, available: false }, // today totally filled
				{ day: 21, available: true }, // tomorow hasn't any appointments
			]),
		);
	});
});
