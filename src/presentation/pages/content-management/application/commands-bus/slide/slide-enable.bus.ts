import { Injectable, inject } from '@angular/core';
import { SlideEnableCommand } from '@pages/content-management/application/commands/slide/slide-enable.command';
import { SlideEnableHandler } from '@pages/content-management/application/commands-handlers/slide/slide-enable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideEnableBus {
    private readonly filterHandler = inject(SlideEnableHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof SlideEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
