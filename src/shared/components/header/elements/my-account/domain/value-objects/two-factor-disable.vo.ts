import { TwoFactorDisableDto } from '../../application/dto/two-factor-disable.dto';
import { TwoFactorDisableProps } from '../models/props/two-factor-disable.props';

export class TwoFactorDisableVo {
    private constructor(public readonly props: TwoFactorDisableProps) {}

    static fromDto(dto: TwoFactorDisableDto): TwoFactorDisableVo {
        return new TwoFactorDisableVo({
            userId: dto.userId,
            email: dto.email.trim().toLowerCase(),
        });
    }
}
