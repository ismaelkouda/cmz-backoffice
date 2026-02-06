import { ProfilsHabilitationsItemApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-response-api.dto';

export class ProfilsHabilitationsEntity {
    constructor(
        public readonly uniqId: string,
        public name: string,
        public slug: string,
        public description: string,
        public usersCount: string,
        public isActive: boolean,
        public createdAt: string
    ) {}

    static fromDto(
        dto: ProfilsHabilitationsItemApiDto
    ): ProfilsHabilitationsEntity {
        return new ProfilsHabilitationsEntity(
            dto.uniq_id,
            dto.name,
            dto.slug,
            dto.description,
            dto.users_count,
            dto.is_active,
            dto.created_at
        );
    }

    public with(
        dto: ProfilsHabilitationsItemApiDto
    ): ProfilsHabilitationsEntity {
        if (this.createdAt === dto.created_at) {
            return this;
        }
        return ProfilsHabilitationsEntity.fromDto(dto);
    }
}
