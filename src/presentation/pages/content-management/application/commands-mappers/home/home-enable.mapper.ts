import { HomeEnableCommand } from '@pages/content-management/application/commands/home/home-enable.command';

export function homeEnableCommandMapper(command: HomeEnableCommand) {
    return {
        uniqId: command.uniqId,
    };
}
