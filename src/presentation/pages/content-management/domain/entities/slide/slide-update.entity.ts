import { SlideUpdateVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-update.vo';

export class SlideUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly role: string
    ) {}
    static fromVo(vo: SlideUpdateVo): SlideUpdateEntity {
        return new SlideUpdateEntity(
            vo.uniqId,
            vo.firstName,
            vo.lastName,
            vo.email,
            vo.phone,
            vo.role
        );
    }
}
