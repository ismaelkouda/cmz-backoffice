import { HomeCreateCommand } from '@pages/content-management/application/commands/home/home-create.command';

export function homeCreateCommandMapper(command: HomeCreateCommand) {
    return { ...command };
}
