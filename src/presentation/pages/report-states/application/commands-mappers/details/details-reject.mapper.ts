import { DetailsRejectCommand } from '@pages/report-states/application/commands/details/details-reject.command';

export function detailsRejectCommandMapper(command: DetailsRejectCommand) {
    return {
        uniqId: command.uniqId,
        comment: command.comment,
        reason: command.reason,
        callbackType: command.callbackType,
    };
}
