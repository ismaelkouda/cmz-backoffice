import { TeamsDisableCommand } from '@pages/team-organization/application/commands/teams/teams-disable.command';

export function teamsDisableCommandMapper(command: TeamsDisableCommand) {
    return {
        uniqId: command.uniqId,
    };
}
