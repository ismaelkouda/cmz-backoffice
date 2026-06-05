import { TwoFactorRequestProps } from '../models/props/two-factor-request.props';
import { TwoFactorRequestVo } from '../value-objects/two-factor-request.vo';

export class TwoFactorRequestEntity {
    private constructor(public readonly props: TwoFactorRequestProps) {}

    static fromVo(vo: TwoFactorRequestVo): TwoFactorRequestEntity {
        return new TwoFactorRequestEntity(vo.props);
    }
}
