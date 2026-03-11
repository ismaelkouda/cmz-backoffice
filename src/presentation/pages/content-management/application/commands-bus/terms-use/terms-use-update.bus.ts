import { Injectable } from '@angular/core';
import { TermsUseUpdateCommand } from '@pages/content-management/application/commands/terms-use/terms-use-update.command';
import { TermsUseUpdateHandler } from '@pages/content-management/application/commands-handlers/terms-use/terms-use-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
