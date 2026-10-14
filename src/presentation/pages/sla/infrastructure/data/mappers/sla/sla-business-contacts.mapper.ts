import { Injectable } from '@angular/core';
import { BusinessContactItemApiDto } from '@pages/sla/infrastructure/api/dto/sla/business-contact-response-api.dto';
import { BusinessContactSlaItemApiDto } from '@pages/sla/infrastructure/api/dto/sla/business-contact-sla-response-api.dto';
import { SlaBusinessContactEntity } from '@pages/sla/domain/entities/sla/sla-business-contact.entity';
import { SlaBusinessContactSlaEntity } from '@pages/sla/domain/entities/sla/sla-business-contact-sla.entity';

@Injectable({ providedIn: 'root' })
export class SlaBusinessContactsMapper {
    mapContact(dto: BusinessContactItemApiDto): SlaBusinessContactEntity {
        return {
            id: dto.id,
            lastName: dto.last_name,
            firstName: dto.first_name,
            email: dto.email,
            phone: dto.phone,
            isActive: dto.is_active,
            indicatorsCount: dto.indicators_count ?? dto.sla_count ?? 0,
            createdAt: dto.created_at,
        };
    }

    mapSla(dto: BusinessContactSlaItemApiDto): SlaBusinessContactSlaEntity {
        return {
            id: dto.id,
            slaId: dto.sla_id,
            slaType: dto.sla_type ?? '',
            slaName: dto.sla_name,
            description: dto.sla_description ?? '',
            slaCategory: dto.sla_category ?? '',
            updatedAt: dto.updated_at ?? '',
        };
    }
}
