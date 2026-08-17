import { ChatbotDisableDto } from '@shared/components/management/application/dto/chatbot/chatbot-disable.dto';

export class ChatbotDisableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: ChatbotDisableDto): ChatbotDisableVo {
        return new ChatbotDisableVo({
            uniqId: dto.uniqId,
        });
    }
}
