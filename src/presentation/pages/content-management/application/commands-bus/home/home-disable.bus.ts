import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { HomeDisableCommand } from '@presentation/pages/content-management/application/commands/home/home-disable.command';
import { HomeDisableHandler } from '@presentation/pages/content-management/application/commands-handlers/home/home-disable.handler';

@Injectable({ providedIn: 'root' })
export class HomeDisableBus {
    constructor(private readonly filterHandler: HomeDisableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof HomeDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
