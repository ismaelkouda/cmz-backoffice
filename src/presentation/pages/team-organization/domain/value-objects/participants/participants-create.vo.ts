import { ParticipantsCreateDto } from '@pages/team-organization/application/dto/participants/participants-create.dto';
import { normalizePhoneNumber } from '@shared/domain/services/normalize-phone-number';

export class ParticipantsCreateVo {
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly email: string;
    public readonly phone: string;
    // public readonly role: string;

    constructor(props: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        // role: string;
    }) {
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.email = props.email;
        this.phone = props.phone;
        // this.role = props.role;
    }

    static fromDto(dto: ParticipantsCreateDto): ParticipantsCreateVo {
        const phone = normalizePhoneNumber(dto.phone?.trim()) as string;
        return new ParticipantsCreateVo({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone,
            // role: dto.role,
        });
    }
}
