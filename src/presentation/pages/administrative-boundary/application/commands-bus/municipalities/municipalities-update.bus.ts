import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesUpdateCommand } from '@presentation/pages/administrative-boundary/application/commands/municipalities/municipalities-update.command';
import { MunicipalitiesUpdateHandler } from '@presentation/pages/administrative-boundary/application/commands-handlers/municipalities/municipalities-update.handler';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesUpdateBus {
    constructor(private readonly updateHandler: MunicipalitiesUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof MunicipalitiesUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
