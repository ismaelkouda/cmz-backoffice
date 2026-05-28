import { Injectable, inject } from '@angular/core';
import { RegionsDeleteCommand } from '@pages/administrative-boundary/application/commands/regions/regions-delete.command';
import { RegionsDeleteHandler } from '@pages/administrative-boundary/application/commands-handlers/regions/regions-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegionsDeleteBus {
    private readonly deleteHandler = inject(RegionsDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof RegionsDeleteCommand) {
            return this.deleteHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
