import { Injectable, inject } from '@angular/core';
import { TermsUseDeleteCommand } from '@pages/content-management/application/commands/terms-use/terms-use-delete.command';
import { TermsUseDeleteHandler } from '@pages/content-management/application/commands-handlers/terms-use/terms-use-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseDeleteBus {
    private readonly filterHandler = inject(TermsUseDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TermsUseDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
