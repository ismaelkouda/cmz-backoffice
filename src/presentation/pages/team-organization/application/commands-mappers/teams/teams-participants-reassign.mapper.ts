import { TeamsParticipantsReassignCommand } from '@pages/team-organization/application/commands/teams/teams-participants-reassign.command';

export function teamsParticipantsReassignCommandMapper(
    command: TeamsParticipantsReassignCommand
) {
    return {
        uniqId: command.uniqId,
        participants: command.participants,
    };
}
