import { UsersEnableDto } from '@presentation/pages/settings-security/core/application/dto/users/users-enable.dto';

export class UsersEnableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: UsersEnableDto): UsersEnableVo {
        return new UsersEnableVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
