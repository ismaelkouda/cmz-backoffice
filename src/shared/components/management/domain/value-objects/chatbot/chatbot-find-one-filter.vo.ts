import { ChatbotFindOneFilterDto } from '@shared/components/management/application/dto/chatbot/chatbot-find-one-filter.dto';

export class ChatbotFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: ChatbotFindOneFilterDto): ChatbotFindOneFilterVo {
        return new ChatbotFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
