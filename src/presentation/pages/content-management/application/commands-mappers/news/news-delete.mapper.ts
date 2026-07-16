import { NewsDeleteCommand } from '@pages/content-management/application/commands/news/news-delete.command';

export function newsDeleteCommandMapper(command: NewsDeleteCommand) {
    return {
        uniqId: command.uniqId,
    };
}
