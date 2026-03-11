import { NewsDisableVo } from '@pages/content-management/domain/value-objects/news/news-disable.vo';

export class NewsDisableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: NewsDisableVo): NewsDisableEntity {
        return new NewsDisableEntity(vo.uniqId);
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
