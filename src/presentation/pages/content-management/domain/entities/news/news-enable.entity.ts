import { NewsEnableVo } from '@presentation/pages/content-management/domain/value-objects/news/news-enable.vo';

export class NewsEnableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: NewsEnableVo): NewsEnableEntity {
        return new NewsEnableEntity(vo.uniqId);
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
