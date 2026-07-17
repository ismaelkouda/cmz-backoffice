import { ParticipantsCreateCommand } from '@pages/team-organization/application/commands/participants/participants-create.command';

export function participantsCreateCommandMapper(
    command: ParticipantsCreateCommand
) {
    return {
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        phone: command.phone,
        role: command?.role,
        team: command?.team,
    };
}
