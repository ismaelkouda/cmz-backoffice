import { Injectable } from '@angular/core';

import { ActionDropdown } from '@shared/domain/enums/action-dropdown.enum';

import { ActionDropdownDto } from '../dtos/action-dropdown.dto';
@Injectable({
    providedIn: 'root',
})
export class ActionDropdownMapper {
    mapFromDto(dtoValue: ActionDropdownDto): ActionDropdown {
        const methodMap: Record<ActionDropdownDto, ActionDropdown> = {
            [ActionDropdownDto.ACTIVE]: ActionDropdown.ACTIVE,
            [ActionDropdownDto.INACTIVE]: ActionDropdown.INACTIVE,
            [ActionDropdownDto.PUBLISHED]: ActionDropdown.PUBLISHED,
            [ActionDropdownDto.UNPUBLISHED]: ActionDropdown.UNPUBLISHED,
            [ActionDropdownDto.AFFECTED]: ActionDropdown.AFFECTED,
        };
        return methodMap[dtoValue] || ActionDropdown.INACTIVE;
    }
}
