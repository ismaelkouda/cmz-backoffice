import { TeamsEnableCommand } from '@pages/team-organization/application/commands/teams/teams-enable.command';

export function teamsEnableCommandMapper(command: TeamsEnableCommand) {
    return {
        uniqId: command.uniqId,
    };
}
