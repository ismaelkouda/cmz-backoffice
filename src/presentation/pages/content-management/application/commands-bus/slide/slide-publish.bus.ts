import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { SlidePublishCommand } from '@presentation/pages/content-management/application/commands/slide/slide-publish.command';
import { SlidePublishHandler } from '@presentation/pages/content-management/application/commands-handlers/slide/slide-publish.handler';

@Injectable({ providedIn: 'root' })
export class SlidePublishBus {
    constructor(private readonly filterHandler: SlidePublishHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof SlidePublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
