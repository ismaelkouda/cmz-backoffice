import { NewsPublishVo } from '@presentation/pages/content-management/domain/value-objects/news/news-publish.vo';

export class NewsPublishEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: NewsPublishVo): NewsPublishEntity {
        return new NewsPublishEntity(vo.uniqId);
    }

    appliesToAdminScope(): boolean {
        return this.uniqId === 'ADMIN_ACTION';
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
        });
    }
}
