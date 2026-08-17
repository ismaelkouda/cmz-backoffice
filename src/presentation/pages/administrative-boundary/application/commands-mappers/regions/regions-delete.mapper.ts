import { RegionsDeleteCommand } from '@pages/administrative-boundary/application/commands/regions/regions-delete.command';

export function regionsDeleteCommandMapper(command: RegionsDeleteCommand) {
    return {
        uniqId: command.uniqId,
    };
}
