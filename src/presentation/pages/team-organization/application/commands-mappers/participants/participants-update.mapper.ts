import { ParticipantsUpdateCommand } from '@pages/team-organization/application/commands/participants/participants-update.command';

export function participantsUpdateCommandMapper(
    command: ParticipantsUpdateCommand
) {
    return {
        uniqId: command.uniqId,
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        phone: command.phone,
        role: command?.role,
        team: command?.team,
    };
}
