import { TeamsUpdateCommand } from '@pages/team-organization/application/commands/teams/teams-update.command';

export function teamsUpdateCommandMapper(command: TeamsUpdateCommand) {
    return {
        uniqId: command.uniqId,
        // code: command.code,
        name: command.name,
        description: command.description,
        reportTypes: command.reportTypes,
        operators: command.operators,
        permissions: command.permissions,
    };
}
