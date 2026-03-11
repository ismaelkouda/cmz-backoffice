import { Injectable } from '@angular/core';
import { SlideDisableCommand } from '@pages/content-management/application/commands/slide/slide-disable.command';
import { SlideDisableHandler } from '@pages/content-management/application/commands-handlers/slide/slide-disable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideDisableBus {
    constructor(private readonly filterHandler: SlideDisableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof SlideDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
