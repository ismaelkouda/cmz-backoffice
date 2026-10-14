import { Injectable } from '@angular/core';
import { SlaEscalationContactItemApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-escalation-contact-response-api.dto';
import { SlaEscalationContactEntity } from '@pages/sla/domain/entities/sla/sla-escalation-contact.entity';

@Injectable({ providedIn: 'root' })
export class SlaEscalationContactMapper {
    map(dto: SlaEscalationContactItemApiDto): SlaEscalationContactEntity {
        return {
            id: dto.id,
            type: dto.type,
            firstName: dto.first_name ?? '',
            lastName: dto.last_name ?? '',
            email: dto.email ?? '',
            phone: dto.phone ?? '',
            whatsapp: dto.whatsapp ?? '',
            telegram: dto.telegram ?? '',
            jobTitle: dto.job_title ?? '',
            isActive: dto.is_active,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };
    }
}
