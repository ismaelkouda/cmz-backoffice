import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesDeleteCommand } from '@presentation/pages/administrative-boundary/application/commands/municipalities/municipalities-delete.command';
import { MunicipalitiesDeleteHandler } from '@presentation/pages/administrative-boundary/application/commands-handlers/municipalities/municipalities-delete.handler';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesDeleteBus {
    constructor(private readonly deleteHandler: MunicipalitiesDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof MunicipalitiesDeleteCommand) {
            return this.deleteHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
