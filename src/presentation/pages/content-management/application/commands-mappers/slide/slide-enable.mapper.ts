import { SlideEnableCommand } from '@pages/content-management/application/commands/slide/slide-enable.command';

export function slideEnableCommandMapper(command: SlideEnableCommand) {
    return {
        uniqId: command.uniqId,
    };
}
