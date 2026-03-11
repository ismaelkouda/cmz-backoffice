import { UsersSelectItemApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-select-api.dto';

export class UsersSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(dto: UsersSelectItemApiDto): UsersSelectEntity {
        return new UsersSelectEntity(dto.id, dto.fullName);
    }

    public with(dto: UsersSelectItemApiDto): UsersSelectEntity {
        if (this.value === dto.id && this.label === dto.fullName) {
            return this;
        }
        return UsersSelectEntity.fromDto(dto);
    }
}
