import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesCreateCommand } from '@presentation/pages/administrative-boundary/application/commands/municipalities/municipalities-create.command';
import { MunicipalitiesCreateHandler } from '@presentation/pages/administrative-boundary/application/commands-handlers/municipalities/municipalities-create.handler';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesCreateBus {
    constructor(private readonly createHandler: MunicipalitiesCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof MunicipalitiesCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
