import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DepartmentsUpdateCommand } from '@presentation/pages/administrative-boundary/application/commands/departments/departments-update.command';
import { DepartmentsUpdateHandler } from '@presentation/pages/administrative-boundary/application/commands-handlers/departments/departments-update.handler';

@Injectable({ providedIn: 'root' })
export class DepartmentsUpdateBus {
    constructor(private readonly updateHandler: DepartmentsUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DepartmentsUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
