import { NewsCreateVo } from '@pages/content-management/domain/value-objects/news/news-create.vo';

export class NewsCreateEntity {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly role: string
    ) {}

    static fromVo(vo: NewsCreateVo): NewsCreateEntity {
        return new NewsCreateEntity(
            vo.firstName,
            vo.lastName,
            vo.email,
            vo.phone,
            vo.role
        );
    }
}
