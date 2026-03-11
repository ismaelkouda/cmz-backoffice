import { Injectable } from '@angular/core';
import { MessagingQuery } from '@pages/communication/application/queries/messaging/messaging.query';
import { MessagingUseCase } from '@pages/communication/application/use-cases/messaging/messaging.use-case';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingHandler {
    constructor(private readonly useCase: MessagingUseCase) {}

    execute(
        command: MessagingQuery,
        page: string
    ): Observable<Paginate<MessagingEntity>> {
        return this.useCase.execute(
            {
                reportId: command.reportId,
                search: command.search,
                targetType: command.targetType,
                region: command.region,
                department: command.department,
                municipality: command.municipality,
                channels: command.channels,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
