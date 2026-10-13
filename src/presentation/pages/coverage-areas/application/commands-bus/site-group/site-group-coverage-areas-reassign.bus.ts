import { Injectable, inject } from '@angular/core';
import { SiteGroupCoverageAreasReassignCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-coverage-areas-reassign.command';
import { SiteGroupCoverageAreasReassignHandler } from '@pages/coverage-areas/application/commands-handlers/site-group/site-group-coverage-areas-reassign.handler';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasReassignBus {
    private readonly handler = inject(SiteGroupCoverageAreasReassignHandler);

    dispatch(command: SiteGroupCoverageAreasReassignCommand) {
        if (command instanceof SiteGroupCoverageAreasReassignCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
