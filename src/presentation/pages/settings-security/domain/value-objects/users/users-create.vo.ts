import { UsersCreateDto } from '@pages/settings-security/application/dto/users/users-create.dto';

export class UsersCreateVo {
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly email: string;
    public readonly phone: string;
    public readonly profile: string;
    // public readonly role: string;

    constructor(props: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        profile: string;
        // role: string;
    }) {
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.email = props.email;
        this.phone = props.phone;
        this.profile = props.profile;
        // this.role = props.role;
    }

    static fromDto(dto: UsersCreateDto): UsersCreateVo {
        return new UsersCreateVo({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            profile: dto.profile,
            // role: dto.role,
        });
    }
}
