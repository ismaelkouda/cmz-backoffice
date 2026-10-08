import { NotificationsFilterContract } from '@presentation/pages/communication/domain/contracts/notifications/notifications-filter.contract';
import { validateNotificationsFilter } from '@presentation/pages/communication/domain/validators/notifications/notifications-filter.validator';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class NotificationsFilterVo {
    constructor(
        public readonly search?: string,
        public readonly type?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromContract(
        contract: NotificationsFilterContract
    ): NotificationsFilterVo {
        validateNotificationsFilter(contract);
        const endDate =
            contract.startDate && !contract.endDate
                ? new Date()
                : contract.endDate;
        const period =
            contract.startDate || endDate
                ? DatePeriod.create(
                      contract.startDate?.toISOString(),
                      endDate?.toISOString()
                  )
                : undefined;

        return new NotificationsFilterVo(
            contract.search?.trim(),
            contract.type,
            period
        );
    }
}

export function notificationsFilterVo(
    contract: NotificationsFilterContract
): NotificationsFilterVo {
    return NotificationsFilterVo.fromContract(contract);
}
