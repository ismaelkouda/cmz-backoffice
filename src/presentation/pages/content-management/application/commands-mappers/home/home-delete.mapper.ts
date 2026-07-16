import { HomeDeleteCommand } from '@pages/content-management/application/commands/home/home-delete.command';

export function homeDeleteCommandMapper(command: HomeDeleteCommand) {
    return {
        uniqId: command.uniqId,
    };
}
