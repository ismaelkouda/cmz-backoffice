import { SlideUpdateDto } from '@presentation/pages/content-management/application/dto/slide/slide-update.dto';

export class SlideUpdateVo {
    public readonly uniqId: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly email: string;
    public readonly phone: string;
    public readonly role: string;

    constructor(props: {
        uniqId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        role: string;
    }) {
        this.uniqId = props.uniqId;
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.email = props.email;
        this.phone = props.phone;
        this.role = props.role;
    }

    static fromDto(dto: SlideUpdateDto): SlideUpdateVo {
        return new SlideUpdateVo({
            uniqId: dto.uniqId,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            role: dto.role,
        });
    }
}
