import { SiteGroupDeleteCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-delete.command';
import { SiteGroupDeleteContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-delete.contract';

export function siteGroupDeleteCommandMapper(
    command: SiteGroupDeleteCommand
): SiteGroupDeleteContract {
    return {
        uniqId: command.uniqId,
    };
}
