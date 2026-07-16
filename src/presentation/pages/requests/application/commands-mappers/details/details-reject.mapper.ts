import { DetailsRejectCommand } from '@pages/requests/application/commands/details/details-reject.command';

export function detailsRejectCommandMapper(command: DetailsRejectCommand) {
    return {
        uniqId: command.uniqId,
        comment: command.comment,
        reason: command.reason,
        callbackType: command.callbackType,
    };
}
