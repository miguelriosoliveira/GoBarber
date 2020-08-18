import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notifications';

export default interface INotificationsRepository {
	create(data: ICreateNotificationDTO): Promise<Notification>;
}
