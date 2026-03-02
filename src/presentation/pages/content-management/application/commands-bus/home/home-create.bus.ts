import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { HomeCreateCommand } from '@presentation/pages/content-management/application/commands/home/home-create.command';
import { HomeCreateHandler } from '@presentation/pages/content-management/application/commands-handlers/home/home-create.handler';

@Injectable({ providedIn: 'root' })
export class HomeCreateBus {
    constructor(private readonly createHandler: HomeCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof HomeCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
