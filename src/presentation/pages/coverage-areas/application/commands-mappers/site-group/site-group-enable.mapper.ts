import { SiteGroupEnableCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-enable.command';
import { SiteGroupEnableContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-enable.contract';

export function siteGroupEnableCommandMapper(
    command: SiteGroupEnableCommand
): SiteGroupEnableContract {
    return command;
}
