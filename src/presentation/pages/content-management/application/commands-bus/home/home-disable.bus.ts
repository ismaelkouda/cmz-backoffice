import { Injectable, inject } from '@angular/core';
import { HomeDisableCommand } from '@pages/content-management/application/commands/home/home-disable.command';
import { HomeDisableHandler } from '@pages/content-management/application/commands-handlers/home/home-disable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeDisableBus {
    private readonly filterHandler = inject(HomeDisableHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof HomeDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
