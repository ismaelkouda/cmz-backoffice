import { Injectable, inject } from '@angular/core';
import { SlideDeleteCommand } from '@pages/content-management/application/commands/slide/slide-delete.command';
import { SlideDeleteHandler } from '@pages/content-management/application/commands-handlers/slide/slide-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideDeleteBus {
    private readonly filterHandler = inject(SlideDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof SlideDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
