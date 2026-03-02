import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TermsUseUpdateCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-update.command';
import { TermsUseUpdateHandler } from '@presentation/pages/content-management/application/commands-handlers/terms-use/terms-use-update.handler';

@Injectable({ providedIn: 'root' })
export class TermsUseUpdateBus {
    constructor(private readonly updateHandler: TermsUseUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TermsUseUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
