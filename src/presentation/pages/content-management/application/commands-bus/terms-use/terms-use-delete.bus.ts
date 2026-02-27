import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TermsUseDeleteCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-delete.command';
import { TermsUseDeleteHandler } from '@presentation/pages/content-management/application/commands-handlers/terms-use/terms-use-delete.handler';

@Injectable({ providedIn: 'root' })
export class TermsUseDeleteBus {
    constructor(private readonly filterHandler: TermsUseDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TermsUseDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
