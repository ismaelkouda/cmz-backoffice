import { TeamsParticipantsRemoveCommand } from '@pages/team-organization/application/commands/teams/teams-participants-remove.command';

export function teamsParticipantsRemoveCommandMapper(
    command: TeamsParticipantsRemoveCommand
) {
    return {
        uniqId: command.uniqId,
        participants: command.participants,
    };
}
