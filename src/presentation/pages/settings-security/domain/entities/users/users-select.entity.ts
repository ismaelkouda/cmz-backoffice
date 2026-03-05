import { UsersSelectItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/users/users-select-api.dto';

export class UsersSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(dto: UsersSelectItemApiDto): UsersSelectEntity {
        return new UsersSelectEntity(dto.code, dto.name);
    }

    public with(dto: UsersSelectItemApiDto): UsersSelectEntity {
        if (this.value === dto.code && this.label === dto.name) {
            return this;
        }
        return UsersSelectEntity.fromDto(dto);
    }
}
