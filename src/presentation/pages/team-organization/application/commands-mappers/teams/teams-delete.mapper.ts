import { TeamsDeleteCommand } from '@pages/team-organization/application/commands/teams/teams-delete.command';

export function teamsDeleteCommandMapper(command: TeamsDeleteCommand) {
    return {
        uniqId: command.uniqId,
    };
}
