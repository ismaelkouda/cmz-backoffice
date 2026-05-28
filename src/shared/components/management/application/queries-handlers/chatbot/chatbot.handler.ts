import { Injectable, inject } from '@angular/core';
import { ChatbotQuery } from '@shared/components/management/application/queries/chatbot/chatbot.query';
import { ChatbotUseCase } from '@shared/components/management/application/use-cases/chatbot/chatbot.use-case';
import { ChatbotEntity } from '@shared/components/management/domain/entities/chatbot/chatbot.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotHandler {
    private readonly useCase = inject(ChatbotUseCase);

    execute(
        command: ChatbotQuery,
        page: string
    ): Observable<Paginate<ChatbotEntity>> {
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
