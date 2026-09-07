import { TwoFactorEnableDto } from '../../application/dto/two-factor-enable.dto';
import { TwoFactorEnableProps } from '../models/props/two-factor-enable.props';

export class TwoFactorEnableVo {
    private constructor(public readonly props: TwoFactorEnableProps) {}

    static fromDto(dto: TwoFactorEnableDto): TwoFactorEnableVo {
        return new TwoFactorEnableVo({
            otp: dto.otp,
            channel: dto.channel,
        });
    }
}
