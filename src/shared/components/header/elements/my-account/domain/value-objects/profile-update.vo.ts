import { ProfileUpdateDto } from '../../application/dto/profile-update.dto';
import { ProfileUpdateProps } from '../models/props/profile-update.props';

export class ProfileUpdateVo {
    private constructor(public readonly props: ProfileUpdateProps) {}

    static fromDto(dto: ProfileUpdateDto): ProfileUpdateVo {
        return new ProfileUpdateVo({
            id: dto.id,
            lastName: dto.lastName.trim(),
            firstName: dto.firstName.trim(),
            email: dto.email.trim().toLowerCase(),
            phone: dto.phone.replaceAll(/\D/g, ''),
        });
    }
}
