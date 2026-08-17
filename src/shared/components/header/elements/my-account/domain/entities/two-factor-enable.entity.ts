import { TwoFactorEnableProps } from '../models/props/two-factor-enable.props';
import { TwoFactorEnableVo } from '../value-objects/two-factor-enable.vo';

export class TwoFactorEnableEntity {
    private constructor(public readonly props: TwoFactorEnableProps) {}

    static fromVo(vo: TwoFactorEnableVo): TwoFactorEnableEntity {
        return new TwoFactorEnableEntity(vo.props);
    }
}
