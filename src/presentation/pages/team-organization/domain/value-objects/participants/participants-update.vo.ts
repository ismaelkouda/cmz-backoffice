import { ParticipantsUpdateDto } from '@pages/team-organization/application/dto/participants/participants-update.dto';
import { normalizePhoneNumber } from '@shared/domain/services/normalize-phone-number';

export class ParticipantsUpdateVo {
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

    static fromDto(dto: ParticipantsUpdateDto): ParticipantsUpdateVo {
        const phone = normalizePhoneNumber(dto.phone?.trim()) as string;
        return new ParticipantsUpdateVo({
            uniqId: dto.uniqId,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone,
            role: dto.role,
        });
    }
}
