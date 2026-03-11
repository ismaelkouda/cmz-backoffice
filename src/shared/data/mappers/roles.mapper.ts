import { Injectable } from '@angular/core';
import { RolesDto } from '@shared/data/dto/roles.dto';
import { Roles } from '@shared/domain/enums/roles.enum';

@Injectable({
    providedIn: 'root',
})
export class RolesMapper {
    mapFromDto(dtoValue: RolesDto): Roles {
        const methodMap: Record<RolesDto, Roles> = {
            [RolesDto.SUPERVISOR]: Roles.SUPERVISOR,
            [RolesDto.LEADER]: Roles.LEADER,
            [RolesDto.AGENT]: Roles.AGENT,
        };
        return methodMap[dtoValue] || Roles.AGENT;
    }
}
