import { SlideUpdateCommand } from '@pages/content-management/application/commands/slide/slide-update.command';

export function slideUpdateCommandMapper(command: SlideUpdateCommand) {
    return { ...command };
}
