import { Injectable, inject } from '@angular/core';
import { SiteGroupCoverageAreasRemoveCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-coverage-areas-remove.command';
import { SiteGroupCoverageAreasRemoveHandler } from '@pages/coverage-areas/application/commands-handlers/site-group/site-group-coverage-areas-remove.handler';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasRemoveBus {
    private readonly handler = inject(SiteGroupCoverageAreasRemoveHandler);

    dispatch(command: SiteGroupCoverageAreasRemoveCommand) {
        if (command instanceof SiteGroupCoverageAreasRemoveCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
