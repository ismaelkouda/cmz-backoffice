import { HomeDisableCommand } from '@pages/content-management/application/commands/home/home-disable.command';

export function homeDisableCommandMapper(command: HomeDisableCommand) {
    return {
        uniqId: command.uniqId,
    };
}
