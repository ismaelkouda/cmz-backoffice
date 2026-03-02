import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { SlideDeleteCommand } from '@presentation/pages/content-management/application/commands/slide/slide-delete.command';
import { SlideDeleteHandler } from '@presentation/pages/content-management/application/commands-handlers/slide/slide-delete.handler';

@Injectable({ providedIn: 'root' })
export class SlideDeleteBus {
    constructor(private readonly filterHandler: SlideDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof SlideDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
