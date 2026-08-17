import { TeamsParticipantsAssignCommand } from '@pages/team-organization/application/commands/teams/teams-participants-assign.command';

export function teamsParticipantsAssignCommandMapper(
    command: TeamsParticipantsAssignCommand
) {
    return {
        uniqId: command.uniqId,
        role: command.role,
        participants: command.participants,
    };
}
