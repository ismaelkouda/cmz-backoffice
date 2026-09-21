import { Injectable, inject } from '@angular/core';
import { CoverageAreaFilters } from '@pages/interactive-map/domain/models/interactive-map-report.model';
import { ReportsRepository } from '@pages/interactive-map/domain/repositories/reports-repository.interface';

@Injectable({ providedIn: 'root' })
export class GetCoverageAreasTileUrlUseCase {
    private readonly repository = inject(ReportsRepository);

    execute(filters: CoverageAreaFilters): string {
        return this.repository.getCoverageAreasTileUrl(filters);
    }
}
