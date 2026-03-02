import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { HomeUpdateCommand } from '@presentation/pages/content-management/application/commands/home/home-update.command';
import { HomeUpdateHandler } from '@presentation/pages/content-management/application/commands-handlers/home/home-update.handler';

@Injectable({ providedIn: 'root' })
export class HomeUpdateBus {
    constructor(private readonly updateHandler: HomeUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof HomeUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
