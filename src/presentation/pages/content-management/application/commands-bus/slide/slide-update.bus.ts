import { Injectable, inject } from '@angular/core';
import { SlideUpdateCommand } from '@pages/content-management/application/commands/slide/slide-update.command';
import { SlideUpdateHandler } from '@pages/content-management/application/commands-handlers/slide/slide-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideUpdateBus {
    private readonly updateHandler = inject(SlideUpdateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof SlideUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
