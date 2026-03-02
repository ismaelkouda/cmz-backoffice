import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DepartmentsCreateCommand } from '@presentation/pages/administrative-boundary/application/commands/departments/departments-create.command';
import { DepartmentsCreateHandler } from '@presentation/pages/administrative-boundary/application/commands-handlers/departments/departments-create.handler';

@Injectable({ providedIn: 'root' })
export class DepartmentsCreateBus {
    constructor(private readonly createHandler: DepartmentsCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DepartmentsCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
