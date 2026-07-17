import { NewsUpdateCommand } from '@pages/content-management/application/commands/news/news-update.command';

export function newsUpdateCommandMapper(command: NewsUpdateCommand) {
    return { ...command };
}
