import { HomeUpdateCommand } from '@pages/content-management/application/commands/home/home-update.command';

export function homeUpdateCommandMapper(command: HomeUpdateCommand) {
    return { ...command };
}
