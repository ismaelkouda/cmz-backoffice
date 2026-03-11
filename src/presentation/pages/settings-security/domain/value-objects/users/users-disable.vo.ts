import { UsersDisableDto } from '@pages/settings-security/application/dto/users/users-disable.dto';

export class UsersDisableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: UsersDisableDto): UsersDisableVo {
        return new UsersDisableVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
