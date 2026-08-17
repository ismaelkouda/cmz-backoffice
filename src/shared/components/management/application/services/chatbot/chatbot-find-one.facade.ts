import { inject, Injectable } from '@angular/core';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { ChatbotFindOneFilterDto } from '@shared/components/management/application/dto/chatbot/chatbot-find-one-filter.dto';
import { ChatbotFindOneQuery } from '@shared/components/management/application/queries/chatbot/chatbot-find-one.query';
import { ChatbotFindOneBus } from '@shared/components/management/application/queries-bus/chatbot/chatbot-find-one.bus';
import { ChatbotFindOneEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one.entity';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ChatbotFindOneFacade extends ObjectBaseFacade<
    ChatbotFindOneEntity,
    ChatbotFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ChatbotFindOneBus);

    read(filter: ChatbotFindOneFilterDto, options: FetchOptions = {}): void {
        const command = new ChatbotFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
