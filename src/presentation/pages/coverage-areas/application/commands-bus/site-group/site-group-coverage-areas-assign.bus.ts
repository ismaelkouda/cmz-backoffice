import { Injectable, inject } from '@angular/core';
import { SiteGroupCoverageAreasAssignCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-coverage-areas-assign.command';
import { SiteGroupCoverageAreasAssignHandler } from '@pages/coverage-areas/application/commands-handlers/site-group/site-group-coverage-areas-assign.handler';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasAssignBus {
    private readonly handler = inject(SiteGroupCoverageAreasAssignHandler);

    dispatch(command: SiteGroupCoverageAreasAssignCommand) {
        if (command instanceof SiteGroupCoverageAreasAssignCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
