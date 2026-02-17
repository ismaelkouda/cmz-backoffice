import { UsersDeleteDto } from '@presentation/pages/settings-security/core/application/dto/users/users-delete.dto';

export class UsersDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: UsersDeleteDto): UsersDeleteVo {
        return new UsersDeleteVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
