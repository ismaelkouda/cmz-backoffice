import { DetailsApproveCommand } from '@pages/report-states/application/commands/details/details-approve.command';

export function detailsApproveCommandMapper(command: DetailsApproveCommand) {
    return {
        uniqId: command.uniqId,
        comment: command.comment,
        approvalType: command.approvalType,
        callbackType: command.callbackType,
        coordinates: command.coordinates,
        locationName: command.locationName,
        reportType: command.reportType,
        operators: command.operators,
        description: command.description,
        decision: command.decision,
        placeDescription: command.placeDescription,
        reason: command.reason,
        placePhoto: command.placePhoto,
    };
}
