import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TasksEntity } from '@presentation/pages/finalization/domain/entities/tasks/tasks.entity';
import { TasksTableVM } from '@presentation/pages/finalization/domain/view-models/tasks-table.vm';

@Injectable({ providedIn: 'root' })
export class TasksTableMapper {
    constructor(private translate: TranslateService) {}

    toVM(entity: TasksEntity): TasksTableVM {
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
            createdAt: entity.createdAt,
        };
    }

    toVMList(entities: TasksEntity[]): TasksTableVM[] {
        return entities.map((e) => this.toVM(e));
    }
}
