import { Injectable, inject } from '@angular/core';
import { TermsUseCreateCommand } from '@pages/content-management/application/commands/terms-use/terms-use-create.command';
import { TermsUseCreateHandler } from '@pages/content-management/application/commands-handlers/terms-use/terms-use-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseCreateBus {
    private readonly createHandler = inject(TermsUseCreateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TermsUseCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
