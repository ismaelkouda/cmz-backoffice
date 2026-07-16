import { DetailsTakeCommand } from '@pages/report-states/application/commands/details/details-take.command';

export function detailsTakeCommandMapper(command: DetailsTakeCommand) {
    return {
        uniqId: command.uniqId,
    };
}
