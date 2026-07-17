import { SiteGroupDisableCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-disable.command';
import { SiteGroupDisableContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-disable.contract';

export function siteGroupDisableCommandMapper(
    command: SiteGroupDisableCommand
): SiteGroupDisableContract {
    return {
        uniqId: command.uniqId,
    };
}
