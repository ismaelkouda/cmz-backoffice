import { NewsUnpublishCommand } from '@pages/content-management/application/commands/news/news-unpublish.command';

export function newsUnpublishCommandMapper(command: NewsUnpublishCommand) {
    return {
        uniqId: command.uniqId,
    };
}
