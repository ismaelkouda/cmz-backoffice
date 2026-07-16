import { DetailsFinalizeCommand } from '@pages/finalization/application/commands/details/details-finalize.command';

export function detailsFinalizeCommandMapper(command: DetailsFinalizeCommand) {
    return {
        uniqId: command.uniqId,
        comment: command.comment,
    };
}
