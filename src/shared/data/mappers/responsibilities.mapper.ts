import { Injectable } from '@angular/core';
import { ResponsibilitiesDto } from '@shared/data/dto/responsibilities.dto';
import { Responsibilities } from '@shared/domain/enums/responsibilities.enum';

@Injectable({
    providedIn: 'root',
})
export class ResponsibilitiesMapper {
    mapFromDto(dtoValue: ResponsibilitiesDto): Responsibilities {
        const methodMap: Record<ResponsibilitiesDto, Responsibilities> = {
            [ResponsibilitiesDto.SUPERVISOR]: Responsibilities.SUPERVISOR,
            [ResponsibilitiesDto.LEADER]: Responsibilities.LEADER,
            [ResponsibilitiesDto.AGENT]: Responsibilities.AGENT,
        };
        return methodMap[dtoValue] || Responsibilities.AGENT;
    }
}
