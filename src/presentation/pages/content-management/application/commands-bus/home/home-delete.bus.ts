import { Injectable } from '@angular/core';
import { HomeDeleteCommand } from '@pages/content-management/application/commands/home/home-delete.command';
import { HomeDeleteHandler } from '@pages/content-management/application/commands-handlers/home/home-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeDeleteBus {
    constructor(private readonly filterHandler: HomeDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof HomeDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
