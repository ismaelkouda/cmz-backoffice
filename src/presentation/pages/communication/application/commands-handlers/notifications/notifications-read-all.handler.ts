import { Injectable, inject } from '@angular/core';
import { NotificationsUseCase } from '@pages/communication/application/use-cases/notifications/notifications.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsReadAllHandler {
    private readonly useCase = inject(NotificationsUseCase);

    execute(): Observable<SimpleResponseDto<void>> {
        return this.useCase.readAll();
    }
}
