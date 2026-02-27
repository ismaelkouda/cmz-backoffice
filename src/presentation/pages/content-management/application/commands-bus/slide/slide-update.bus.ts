import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { SlideUpdateCommand } from '@presentation/pages/content-management/application/commands/slide/slide-update.command';
import { SlideUpdateHandler } from '@presentation/pages/content-management/application/commands-handlers/slide/slide-update.handler';

@Injectable({ providedIn: 'root' })
export class SlideUpdateBus {
    constructor(private readonly updateHandler: SlideUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof SlideUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
