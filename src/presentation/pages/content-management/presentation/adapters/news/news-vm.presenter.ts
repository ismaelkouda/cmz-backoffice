import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import { NewsVmProps } from '@pages/content-management/presentation/adapters/news/news-vm-props.interface';

export class NewsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: NewsEntity): NewsVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            title: item.title,

            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),

            createdAt: item.createdAt,
            actionsRef: item.actionsRef,
        };
    }
}
