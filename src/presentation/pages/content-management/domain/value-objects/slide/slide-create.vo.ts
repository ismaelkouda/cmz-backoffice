import { SlideCreateDto } from '@presentation/pages/content-management/application/dto/slide/slide-create.dto';

export class SlideCreateVo {
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly email: string;
    public readonly phone: string;
    public readonly role: string;

    constructor(props: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        role: string;
    }) {
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.email = props.email;
        this.phone = props.phone;
        this.role = props.role;
    }

    static fromDto(dto: SlideCreateDto): SlideCreateVo {
        return new SlideCreateVo({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            role: dto.role,
        });
    }
}
