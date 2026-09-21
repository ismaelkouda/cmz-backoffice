import { RequestEntity } from '@pages/report-states/domain/entities/request/request.entity';
import { RequestVmProps } from '@pages/report-states/presentation/adapters/request/request-vm-props.interface';

export class RequestPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: RequestEntity): RequestVmProps {
        return {
            uniqId: item.uniqId,
            reportTypeLabel: this.t(item.reportType),
            operators: item.operators,
            sourceLabel: this.t(item.source),
            initiatorPhoneNumber: item.initiatorPhoneNumber,
            reportedAt: item.reportedAt,
        };
    }
}
