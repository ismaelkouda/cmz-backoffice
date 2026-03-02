import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DepartmentsDeleteCommand } from '@presentation/pages/administrative-boundary/application/commands/departments/departments-delete.command';
import { DepartmentsDeleteHandler } from '@presentation/pages/administrative-boundary/application/commands-handlers/departments/departments-delete.handler';

@Injectable({ providedIn: 'root' })
export class DepartmentsDeleteBus {
    constructor(private readonly deleteHandler: DepartmentsDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DepartmentsDeleteCommand) {
            return this.deleteHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
