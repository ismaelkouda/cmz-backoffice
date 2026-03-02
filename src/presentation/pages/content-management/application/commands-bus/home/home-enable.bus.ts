import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { HomeEnableCommand } from '@presentation/pages/content-management/application/commands/home/home-enable.command';
import { HomeEnableHandler } from '@presentation/pages/content-management/application/commands-handlers/home/home-enable.handler';

@Injectable({ providedIn: 'root' })
export class HomeEnableBus {
    constructor(private readonly filterHandler: HomeEnableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof HomeEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
