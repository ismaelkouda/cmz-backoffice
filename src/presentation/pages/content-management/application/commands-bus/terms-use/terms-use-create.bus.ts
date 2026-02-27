import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TermsUseCreateCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-create.command';
import { TermsUseCreateHandler } from '@presentation/pages/content-management/application/commands-handlers/terms-use/terms-use-create.handler';

@Injectable({ providedIn: 'root' })
export class TermsUseCreateBus {
    constructor(private readonly createHandler: TermsUseCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TermsUseCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
