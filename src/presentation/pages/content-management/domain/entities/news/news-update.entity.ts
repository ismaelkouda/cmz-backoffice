import { NewsUpdateVo } from '@pages/content-management/domain/value-objects/news/news-update.vo';

export class NewsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly role: string
    ) {}
    static fromVo(vo: NewsUpdateVo): NewsUpdateEntity {
        return new NewsUpdateEntity(
            vo.uniqId,
            vo.firstName,
            vo.lastName,
            vo.email,
            vo.phone,
            vo.role
        );
    }
}
