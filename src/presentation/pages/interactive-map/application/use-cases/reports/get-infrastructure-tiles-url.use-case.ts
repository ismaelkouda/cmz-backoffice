import { Injectable, inject } from '@angular/core';
import { ReportsRepository } from '@pages/interactive-map/domain/repositories/reports-repository.interface';

@Injectable({ providedIn: 'root' })
export class GetInfrastructureTilesUrlUseCase {
    private readonly repository = inject(ReportsRepository);

    execute(typeEquipment: string | string[]): string {
        return this.repository.getInfrastructureTilesUrl(typeEquipment);
    }

    executeScoped(
        reportUniqId: string,
        typeEquipment: string | string[]
    ): string {
        return this.repository.getReportInfrastructureTilesUrl(
            reportUniqId,
            typeEquipment
        );
    }
}
