import { Injectable, inject } from '@angular/core';
import { ResendDefineResponseEntity } from '@presentation/pages/authentication/domain/entities/resend-define/resend-define-response.entity';
import { ResendDefineRepository } from '@presentation/pages/authentication/domain/repositories/resend-define/resend-define.repository';
import { resendDefineRequestVo } from '@presentation/pages/authentication/domain/value-objects/resend-define/resend-define-request.vo';
import { defer, Observable } from 'rxjs';
import { ResendDefineRequestContract } from '@presentation/pages/authentication/domain/contracts/resend-define/resend-define-request.contract';

@Injectable({ providedIn: 'root' })
export class ResendDefineUseCase {
    private readonly repository = inject(ResendDefineRepository);

    execute(
        contract: ResendDefineRequestContract
    ): Observable<ResendDefineResponseEntity> {
        return defer(() =>
            this.repository.execute(resendDefineRequestVo(contract))
        );
    }
}
