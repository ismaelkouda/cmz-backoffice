import { SlideDisableCommand } from '@pages/content-management/application/commands/slide/slide-disable.command';

export function slideDisableCommandMapper(command: SlideDisableCommand) {
    return {
        uniqId: command.uniqId,
    };
}
