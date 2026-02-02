import { ProfilsHabilitationsFreeUsersItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-free-users-response-api.dto';

export class ProfilsHabilitationsFreeUsersEntity {
    constructor(
        public readonly uniqId: string,
        public email: string,
        public phone: string,
        public firstName: string,
        public lastName: string
    ) {}

    static fromDto(
        dto: ProfilsHabilitationsFreeUsersItemApiDto
    ): ProfilsHabilitationsFreeUsersEntity {
        return new ProfilsHabilitationsFreeUsersEntity(
            dto.uniq_id,
            dto.email,
            dto.phone,
            dto.first_name,
            dto.last_name
        );
    }

    public with(
        dto: ProfilsHabilitationsFreeUsersItemApiDto
    ): ProfilsHabilitationsFreeUsersEntity {
        if (this.uniqId === dto.uniq_id) {
            return this;
        }
        return ProfilsHabilitationsFreeUsersEntity.fromDto(dto);
    }
}
