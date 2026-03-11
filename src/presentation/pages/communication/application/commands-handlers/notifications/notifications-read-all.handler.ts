import { Injectable } from '@angular/core';
import { NotificationsUseCase } from '@pages/communication/application/use-cases/notifications/notifications.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsReadAllHandler {
    constructor(private readonly useCase: NotificationsUseCase) {}

    execute(): Observable<SimpleResponseDto<void>> {
        return this.useCase.readAll();
    }
}
