import { Injectable } from '@angular/core';
import { AdministrativeBoundaryDto } from '@shared/data/dto/administrative-boundary.dto';
import { AdministrativeBoundaryEntity } from '@shared/domain/entities/administrative-boundary.entity';

@Injectable({
    providedIn: 'root',
})
export class AdministrativeBoundaryMapper {
    mapToEntity(
        dtoValue: AdministrativeBoundaryDto | null
    ): AdministrativeBoundaryEntity | null {
        if (!dtoValue) {
            return null;
        }

        return new AdministrativeBoundaryEntity(
            dtoValue.id,
            dtoValue.name,
            dtoValue.code
        );
    }

    mapToDto(
        entityValue: AdministrativeBoundaryEntity | null
    ): AdministrativeBoundaryDto | null {
        if (!entityValue) {
            return null;
        }

        return {
            id: entityValue.id,
            name: entityValue.name,
            code: entityValue?.code,
        };
    }
}
