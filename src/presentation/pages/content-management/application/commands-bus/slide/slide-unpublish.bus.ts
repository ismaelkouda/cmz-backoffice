import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { SlideUnpublishCommand } from '@presentation/pages/content-management/application/commands/slide/slide-unpublish.command';
import { SlideUnpublishHandler } from '@presentation/pages/content-management/application/commands-handlers/slide/slide-unpublish.handler';

@Injectable({ providedIn: 'root' })
export class SlideUnpublishBus {
    constructor(private readonly filterHandler: SlideUnpublishHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof SlideUnpublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
