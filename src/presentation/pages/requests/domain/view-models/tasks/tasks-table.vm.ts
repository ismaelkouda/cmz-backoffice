import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { TasksEntity } from '@presentation/pages/requests/domain/entities/tasks/tasks.entity';
import { TasksTable } from '@presentation/pages/requests/domain/interfaces/tasks/tasks-table.interface';

@Injectable({ providedIn: 'root' })
export class TasksTableVm {
    private readonly translate = inject(TranslateService);

    toVM(entity: TasksEntity): TasksTable {
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

    toVMList(entities: TasksEntity[]): TasksTable[] {
        return entities.map((e) => this.toVM(e));
    }
}
