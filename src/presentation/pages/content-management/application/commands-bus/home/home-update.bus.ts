import { Injectable, inject } from '@angular/core';
import { HomeUpdateCommand } from '@pages/content-management/application/commands/home/home-update.command';
import { HomeUpdateHandler } from '@pages/content-management/application/commands-handlers/home/home-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeUpdateBus {
    private readonly updateHandler = inject(HomeUpdateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof HomeUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
