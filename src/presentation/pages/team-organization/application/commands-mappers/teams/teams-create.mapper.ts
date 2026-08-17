import { TeamsCreateCommand } from '@pages/team-organization/application/commands/teams/teams-create.command';

export function teamsCreateCommandMapper(command: TeamsCreateCommand) {
    return {
        // code: command.code,
        name: command.name,
        description: command.description,
        reportTypes: command.reportTypes,
        operators: command.operators,
        permissions: command.permissions,
    };
}
