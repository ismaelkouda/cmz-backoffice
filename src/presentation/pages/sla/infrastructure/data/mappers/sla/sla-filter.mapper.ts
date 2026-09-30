import { Injectable } from '@angular/core';
import { SlaFilterApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-filter-api.dto';
import { SlaFilterEntity } from '@pages/sla/domain/entities/sla/sla-filter.entity';

@Injectable({ providedIn: 'root' })
export class SlaFilterMapper {
    map(contract: SlaFilterEntity | null): SlaFilterApiDto {
        const params: SlaFilterApiDto = {} as SlaFilterApiDto;

        if (contract?.search) {
            params.search = contract.search;
        }

        if (contract?.category) {
            params.category = contract.category;
        }

        return params;
    }
}
