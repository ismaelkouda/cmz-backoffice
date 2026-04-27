import { Injectable } from '@angular/core';
import { RolesDto } from '@shared/data/dto/roles.dto';
import { Roles } from '@shared/domain/enums/roles.enum';

@Injectable({
    providedIn: 'root',
})
export class RolesMapper {
    private readonly dtoToEntity: Record<RolesDto, Roles> = {
        [RolesDto.SUPERVISOR]: Roles.SUPERVISOR,
        [RolesDto['TEAM-LEADER']]: Roles['TEAM-LEADER'],
        [RolesDto.AGENT]: Roles.AGENT,
    };

    private readonly entityToDto: Record<Roles, RolesDto> = {
        [Roles.SUPERVISOR]: RolesDto.SUPERVISOR,
        [Roles['TEAM-LEADER']]: RolesDto['TEAM-LEADER'],
        [Roles.AGENT]: RolesDto.AGENT,
    };

    mapFromDto(dtoValue: RolesDto | null): Roles | null {
        if (!dtoValue) {
            return null;
        }
        return this.dtoToEntity[dtoValue];
    }

    mapToDto(enumValue: Roles): RolesDto {
        return this.entityToDto[enumValue] ?? RolesDto.AGENT;
    }
}
