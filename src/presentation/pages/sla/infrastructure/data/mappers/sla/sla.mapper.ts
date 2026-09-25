import { Injectable } from '@angular/core';
import { SlaEntity } from '@pages/sla/domain/entities/sla/sla.entity';
import { SlaProps } from '@pages/sla/domain/interfaces/sla/sla-props.interface';
import { SlaItemApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-response-api.dto';
import { SlaResponseApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-response-api.dto';

@Injectable({ providedIn: 'root' })
export class SlaMapper {
    mapFromDto(response: SlaResponseApiDto): SlaEntity[] {
        if (response.error) {
            throw new Error(response.message);
        }
        return response.data.map((dto) => this.mapItemFromDto(dto));
    }

    private mapItemFromDto(dto: SlaItemApiDto): SlaEntity {
        const props: SlaProps = {
            id: dto.id,
            name: dto.name,
            description: dto.description,
            isActive: dto.is_active,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        return new SlaEntity(props);
    }
}
