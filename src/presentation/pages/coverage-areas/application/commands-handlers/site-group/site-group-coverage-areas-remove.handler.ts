import { Injectable, inject } from '@angular/core';
import { SiteGroupCoverageAreasRemoveCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-coverage-areas-remove.command';
import { SiteGroupCoverageAreasUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group-coverage-areas.use-case';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasRemoveHandler {
    private readonly useCase = inject(SiteGroupCoverageAreasUseCase);

    execute(command: SiteGroupCoverageAreasRemoveCommand) {
        return this.useCase.remove(command.siteGroupId, {
            coverage_area_ids: command.coverageAreaIds,
        });
    }
}
