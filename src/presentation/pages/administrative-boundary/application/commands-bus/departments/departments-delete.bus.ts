import { Injectable, inject } from '@angular/core';
import { DepartmentsDeleteCommand } from '@pages/administrative-boundary/application/commands/departments/departments-delete.command';
import { DepartmentsDeleteHandler } from '@pages/administrative-boundary/application/commands-handlers/departments/departments-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsDeleteBus {
    private readonly deleteHandler = inject(DepartmentsDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DepartmentsDeleteCommand) {
            return this.deleteHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
