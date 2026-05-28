import { Injectable, inject } from '@angular/core';
import { HomeEnableCommand } from '@pages/content-management/application/commands/home/home-enable.command';
import { HomeEnableHandler } from '@pages/content-management/application/commands-handlers/home/home-enable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeEnableBus {
    private readonly filterHandler = inject(HomeEnableHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof HomeEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
