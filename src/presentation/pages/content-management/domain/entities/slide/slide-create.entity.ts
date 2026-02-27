import { SlideCreateVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-create.vo';

export class SlideCreateEntity {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly role: string
    ) {}

    static fromVo(vo: SlideCreateVo): SlideCreateEntity {
        return new SlideCreateEntity(
            vo.firstName,
            vo.lastName,
            vo.email,
            vo.phone,
            vo.role
        );
    }
}
