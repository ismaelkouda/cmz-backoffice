import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { QueuesEntity } from "@presentation/pages/reports-processing/domain/entities/queues/queues.entity";
import { QueuesTableVM } from "@presentation/pages/reports-processing/domain/view-models/queues-table.vm";

@Injectable({ providedIn: 'root' })
export class QueuesTableMapper {
    constructor(private translate: TranslateService) { }

    toVM(entity: QueuesEntity): QueuesTableVM {
        return {
            uniqId: entity.uniqId,
            initiatorPhoneNumber: entity.initiatorPhoneNumber,
            reportType: entity.reportType,
            reportTypeLabel: this.translate.instant(entity.reportType),
            source: entity.source,
            sourceLabel: this.translate.instant(entity.source),
            operators: entity.operators,
            operatorsLabels: entity.operators.map(op =>
                this.translate.instant(op)
            ),
            createdAt: entity.createdAt,
        };
    }

    toVMList(entities: QueuesEntity[]): QueuesTableVM[] {
        return entities.map(e => this.toVM(e));
    }
}
