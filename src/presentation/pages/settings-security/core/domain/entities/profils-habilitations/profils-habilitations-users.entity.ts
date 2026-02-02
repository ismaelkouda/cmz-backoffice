import { ProfilsHabilitationsUsersItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-users-response-api.dto';

export class ProfilsHabilitationsUsersEntity {
    constructor(
        public readonly uniqId: string,
        public email: string,
        public phone: string,
        public firstName: string,
        public lastName: string
    ) {}

    static fromDto(
        dto: ProfilsHabilitationsUsersItemApiDto
    ): ProfilsHabilitationsUsersEntity {
        return new ProfilsHabilitationsUsersEntity(
            dto.uniq_id,
            dto.email,
            dto.phone,
            dto.first_name,
            dto.last_name
        );
    }

    public with(
        dto: ProfilsHabilitationsUsersItemApiDto
    ): ProfilsHabilitationsUsersEntity {
        if (this.uniqId === dto.uniq_id) {
            return this;
        }
        return ProfilsHabilitationsUsersEntity.fromDto(dto);
    }
}
