import { SiteGroupUpdateCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-update.command';
import { SiteGroupUpdateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-update.contract';

export function siteGroupUpdateCommandMapper(
    command: SiteGroupUpdateCommand
): SiteGroupUpdateContract {
    return command;
}
