import { NewsDeleteVo } from '@pages/content-management/domain/value-objects/news/news-delete.vo';

export class NewsDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: NewsDeleteVo): NewsDeleteEntity {
        return new NewsDeleteEntity(vo.uniqId);
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
