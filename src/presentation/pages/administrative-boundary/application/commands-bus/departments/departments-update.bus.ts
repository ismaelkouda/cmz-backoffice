import { Injectable } from '@angular/core';
import { DepartmentsUpdateCommand } from '@pages/administrative-boundary/application/commands/departments/departments-update.command';
import { DepartmentsUpdateHandler } from '@pages/administrative-boundary/application/commands-handlers/departments/departments-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
