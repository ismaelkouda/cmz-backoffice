import { resendDefineRequestCommandMapper } from '@presentation/pages/authentication/application/commands-mappers/resend-define/resend-define-request.mapper';
import { Injectable, inject } from '@angular/core';
import { ResendDefineResponseEntity } from '@presentation/pages/authentication/domain/entities/resend-define/resend-define-response.entity';
import { ResendDefineRequestCommand } from '@presentation/pages/authentication/application/commands/resend-define/resend-define-request.command';
import { ResendDefineUseCase } from '@presentation/pages/authentication/application/use-cases/resend-define/resend-define.use-case';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResendDefineRequestHandler {
    private readonly useCase = inject(ResendDefineUseCase);

    execute(
        command: ResendDefineRequestCommand
    ): Observable<ResendDefineResponseEntity> {
        return this.useCase.execute(resendDefineRequestCommandMapper(command));
    }
}
