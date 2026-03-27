import { NewsUnpublishVo } from '@pages/content-management/domain/value-objects/news/news-unpublish.vo';

export class NewsUnpublishEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: NewsUnpublishVo): NewsUnpublishEntity {
        return new NewsUnpublishEntity(vo.uniqId);
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
