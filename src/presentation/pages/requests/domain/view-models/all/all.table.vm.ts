import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AllEntity } from '@presentation/pages/requests/domain/entities/all/all.entity';
import { AllTable } from '@presentation/pages/requests/domain/interfaces/all/all-table.interface';

@Injectable({ providedIn: 'root' })
export class AllTableVm {
    private readonly translate = inject(TranslateService);

    toVM(entity: AllEntity): AllTable {
        return {
            uniqId: entity.uniqId,
            initiatorPhoneNumber: entity.initiatorPhoneNumber,
            reportType: entity.reportType,
            reportTypeLabel: this.translate.instant(entity.reportType),
            source: entity.source,
            status: entity.status,
            sourceLabel: this.translate.instant(entity.source),
            operators: entity.operators,
            operatorsLabels: entity.operators.map((op) =>
                this.translate.instant(op)
            ),
            reportedAt: entity.reportedAt,
        };
    }

    toVMList(entities: AllEntity[]): AllTable[] {
        return entities.map((e) => this.toVM(e));
    }
}
