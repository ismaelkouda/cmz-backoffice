import { NewsPublishCommand } from '@pages/content-management/application/commands/news/news-publish.command';

export function newsPublishCommandMapper(command: NewsPublishCommand) {
    return {
        uniqId: command.uniqId,
    };
}
