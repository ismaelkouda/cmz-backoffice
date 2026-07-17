import { NewsCreateCommand } from '@pages/content-management/application/commands/news/news-create.command';

export function newsCreateCommandMapper(command: NewsCreateCommand) {
    return { ...command };
}
