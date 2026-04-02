import { ChatbotDeleteDto } from '@shared/components/management/application/dto/chatbot/chatbot-delete.dto';

export class ChatbotDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: ChatbotDeleteDto): ChatbotDeleteVo {
        return new ChatbotDeleteVo({
            uniqId: dto.uniqId,
        });
    }
}
