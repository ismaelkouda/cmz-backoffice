import { ParticipantsCreateDto } from '@presentation/pages/team-organization/application/dto/participants/participants-create.dto';

export class ParticipantsCreateVo {
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

    static fromDto(dto: ParticipantsCreateDto): ParticipantsCreateVo {
        return new ParticipantsCreateVo({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            role: dto.role,
        });
    }
}
