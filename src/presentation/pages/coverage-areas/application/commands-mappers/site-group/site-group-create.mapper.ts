import { SiteGroupCreateCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-create.command';
import { SiteGroupCreateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-create.contract';

export function siteGroupCreateCommandMapper(
    command: SiteGroupCreateCommand
): SiteGroupCreateContract {
    return {
        code: command.code,
        name: command.name,
        description: command.description,
    };
}
