import { Injectable } from '@angular/core';
import { ActionDropdown } from '@shared/domain/enums/action-dropdown.enum';

import { ActionDropdownDto } from '../dto/action-dropdown.dto';
@Injectable({
    providedIn: 'root',
})
export class ActionDropdownMapper {
    mapFromDto(dtoValue: ActionDropdownDto): ActionDropdown {
        const methodMap: Record<ActionDropdownDto, ActionDropdown> = {
            [ActionDropdownDto.ACTIVE]: ActionDropdown.ACTIVE,
            [ActionDropdownDto.INACTIVE]: ActionDropdown.INACTIVE,
            [ActionDropdownDto.PUBLISH]: ActionDropdown.PUBLISH,
            [ActionDropdownDto.UNPUBLISH]: ActionDropdown.UNPUBLISH,
        };
        return methodMap[dtoValue] || ActionDropdown.INACTIVE;
    }
}
