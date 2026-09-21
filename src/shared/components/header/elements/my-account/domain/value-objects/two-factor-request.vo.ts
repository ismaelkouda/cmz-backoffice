import { TwoFactorRequestDto } from '../../application/dto/two-factor-request.dto';
import { TwoFactorRequestProps } from '../models/props/two-factor-request.props';

export class TwoFactorRequestVo {
    private constructor(public readonly props: TwoFactorRequestProps) {}

    static fromDto(dto: TwoFactorRequestDto): TwoFactorRequestVo {
        return new TwoFactorRequestVo({
            channel: dto.channel,
        });
    }
}
