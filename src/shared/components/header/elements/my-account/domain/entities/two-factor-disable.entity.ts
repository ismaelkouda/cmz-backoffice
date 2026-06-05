import { TwoFactorDisableProps } from '../models/props/two-factor-disable.props';
import { TwoFactorDisableVo } from '../value-objects/two-factor-disable.vo';

export class TwoFactorDisableEntity {
    private constructor(public readonly props: TwoFactorDisableProps) {}

    static fromVo(vo: TwoFactorDisableVo): TwoFactorDisableEntity {
        return new TwoFactorDisableEntity(vo.props);
    }
}
