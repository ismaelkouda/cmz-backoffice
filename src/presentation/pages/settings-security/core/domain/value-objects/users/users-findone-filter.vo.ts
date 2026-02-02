import { UsersFindOneFilterDto } from '@presentation/pages/settings-security/core/application/dtos/users/users-findone-filter.dto';

export class UsersFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: UsersFindOneFilterDto): UsersFindOneFilterVo {
        return new UsersFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
