import { ChatbotEnableDto } from '@shared/components/management/application/dto/chatbot/chatbot-enable.dto';

export class ChatbotEnableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: ChatbotEnableDto): ChatbotEnableVo {
        return new ChatbotEnableVo({
            uniqId: dto.uniqId,
        });
    }
}
