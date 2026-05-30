import { Injectable, inject } from '@angular/core';
import { TermsUsePublishCommand } from '@pages/content-management/application/commands/terms-use/terms-use-publish.command';
import { TermsUsePublishHandler } from '@pages/content-management/application/commands-handlers/terms-use/terms-use-publish.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUsePublishBus {
    private readonly filterHandler = inject(TermsUsePublishHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TermsUsePublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
