import { Injectable } from '@angular/core';
import { Conformity } from '@pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';
import { ConformityDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-conformity-api.dto';

@Injectable({ providedIn: 'root' })
export class ConformityMapper {
    mapFromDto(dto: ConformityDto): Conformity {
        const methodMap: Record<ConformityDto, Conformity> = {
            [ConformityDto.CONFORM]: Conformity.CONFORM,
            [ConformityDto.NON_CONFORM]: Conformity.NON_CONFORM,
            [ConformityDto.IN_PROGRESS]: Conformity.IN_PROGRESS,
            [ConformityDto.UNKNOWN]: Conformity.UNKNOWN,
        };
        return methodMap[dto] ?? Conformity.UNKNOWN;
    }
    mapToDto(value: Conformity): ConformityDto {
        const methodMap: Record<Conformity, ConformityDto> = {
            [Conformity.CONFORM]: ConformityDto.CONFORM,
            [Conformity.NON_CONFORM]: ConformityDto.NON_CONFORM,
            [Conformity.IN_PROGRESS]: ConformityDto.IN_PROGRESS,
            [Conformity.UNKNOWN]: ConformityDto.UNKNOWN,
        };
        return methodMap[value];
    }
}
