import { SlideDeleteCommand } from '@pages/content-management/application/commands/slide/slide-delete.command';

export function slideDeleteCommandMapper(command: SlideDeleteCommand) {
    return {
        uniqId: command.uniqId,
    };
}
