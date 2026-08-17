import { DetailsTakeCommand } from '@pages/requests/application/commands/details/details-take.command';

export function detailsTakeCommandMapper(command: DetailsTakeCommand) {
    return {
        uniqId: command.uniqId,
    };
}
