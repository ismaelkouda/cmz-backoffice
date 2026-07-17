import { DetailsTreatCommand } from '@pages/processing/application/commands/details/details-treat.command';

export function detailsTreatCommandMapper(command: DetailsTreatCommand) {
    return {
        uniqId: command.uniqId,
        comment: command.comment,
    };
}
