import { Injectable, inject } from '@angular/core';
import { SiteGroupCoverageAreasAssignCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-coverage-areas-assign.command';
import { SiteGroupCoverageAreasUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group-coverage-areas.use-case';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasAssignHandler {
    private readonly useCase = inject(SiteGroupCoverageAreasUseCase);

    execute(command: SiteGroupCoverageAreasAssignCommand) {
        return this.useCase.assign(command.siteGroupId, {
            coverage_area_ids: command.coverageAreaIds,
        });
    }
}
