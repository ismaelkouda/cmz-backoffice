import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AllEntity } from "@presentation/pages/report-requests/domain/entities/all/all.entity";
import { AllTableVM } from "@presentation/pages/report-requests/domain/view-models/all-table.vm";

@Injectable({ providedIn: 'root' })
export class AllTableMapper {
    constructor(private translate: TranslateService) { }

    toVM(entity: AllEntity): AllTableVM {
        return {
            uniqId: entity.uniqId,
            initiatorPhoneNumber: entity.initiatorPhoneNumber,
            status: entity.status,
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

    toVMList(entities: AllEntity[]): AllTableVM[] {
        return entities.map(e => this.toVM(e));
    }
}
