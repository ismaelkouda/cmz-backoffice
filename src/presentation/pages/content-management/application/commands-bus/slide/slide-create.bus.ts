import { Injectable } from '@angular/core';
import { SlideCreateCommand } from '@pages/content-management/application/commands/slide/slide-create.command';
import { SlideCreateHandler } from '@pages/content-management/application/commands-handlers/slide/slide-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideCreateBus {
    constructor(private readonly createHandler: SlideCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof SlideCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
