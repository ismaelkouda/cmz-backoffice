import { AdministrativeBoundaryDto } from '@shared/data/dtos/administrative-boundary.dto';
import { AdministrativeBoundaryEntity } from '@shared/domain/entities/administrative-boundary.entity';

import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class AdministrativeBoundaryMapper {
    mapToEntity(
        dtoValue: AdministrativeBoundaryDto | null
    ): AdministrativeBoundaryEntity | null {
        if (!dtoValue) return null;

        return new AdministrativeBoundaryEntity(dtoValue.id, dtoValue.name);
    }

    mapToDto(
        entityValue: AdministrativeBoundaryEntity | null
    ): AdministrativeBoundaryDto | null {
        if (!entityValue) return null;

        return {
            id: entityValue.id,
            name: entityValue.name,
        };
    }
}
