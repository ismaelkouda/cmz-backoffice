import { SlideCreateCommand } from '@pages/content-management/application/commands/slide/slide-create.command';

export function slideCreateCommandMapper(command: SlideCreateCommand) {
    return { ...command };
}
