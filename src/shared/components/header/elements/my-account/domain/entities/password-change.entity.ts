import { PasswordChangeProps } from '../models/props/password-change.props';
import { PasswordChangeVo } from '../value-objects/password-change.vo';

export class PasswordChangeEntity {
    private constructor(public readonly props: PasswordChangeProps) {}

    static fromVo(vo: PasswordChangeVo): PasswordChangeEntity {
        return new PasswordChangeEntity(vo.props);
    }
}
