import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { QueuesEntity } from '@pages/requests/domain/entities/queues/queues.entity';
import { QueuesTable } from '@pages/requests/domain/interfaces/queues/queues-table.interface';

@Injectable({ providedIn: 'root' })
export class QueuesTableVm {
    private readonly translate = inject(TranslateService);

    toVM(entity: QueuesEntity): QueuesTable {
        return {
            uniqId: entity.uniqId,
            initiatorPhoneNumber: entity.initiatorPhoneNumber,
            reportType: entity.reportType,
            reportTypeLabel: this.translate.instant(entity.reportType),
            source: entity.source,
            sourceLabel: this.translate.instant(entity.source),
            operators: entity.operators,
            operatorsLabels: entity.operators.map((op) =>
                this.translate.instant(op)
            ),
            reportedAt: entity.reportedAt,
        };
    }

    toVMList(entities: QueuesEntity[]): QueuesTable[] {
        return entities.map((e) => this.toVM(e));
    }
}
