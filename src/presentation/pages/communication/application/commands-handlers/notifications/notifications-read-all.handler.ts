import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { NotificationsUseCase } from '@presentation/pages/communication/application/use-cases/notifications/notifications.use-case';

@Injectable({ providedIn: 'root' })
export class NotificationsReadAllHandler {
    constructor(private readonly useCase: NotificationsUseCase) {}

    execute(): Observable<SimpleResponseDto<void>> {
        return this.useCase.readAll();
    }
}
