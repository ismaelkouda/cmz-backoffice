import { Injectable, inject } from '@angular/core';
import { MunicipalitiesDeleteCommand } from '@pages/administrative-boundary/application/commands/municipalities/municipalities-delete.command';
import { MunicipalitiesDeleteHandler } from '@pages/administrative-boundary/application/commands-handlers/municipalities/municipalities-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesDeleteBus {
    private readonly deleteHandler = inject(MunicipalitiesDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof MunicipalitiesDeleteCommand) {
            return this.deleteHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
