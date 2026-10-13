import { Injectable, inject } from '@angular/core';
import { SiteGroupCoverageAreasReassignCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-coverage-areas-reassign.command';
import { SiteGroupCoverageAreasUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group-coverage-areas.use-case';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasReassignHandler {
    private readonly useCase = inject(SiteGroupCoverageAreasUseCase);

    execute(command: SiteGroupCoverageAreasReassignCommand) {
        return this.useCase.reassign(command.targetSiteGroupId, {
            coverage_area_ids: command.coverageAreaIds,
        });
    }
}
