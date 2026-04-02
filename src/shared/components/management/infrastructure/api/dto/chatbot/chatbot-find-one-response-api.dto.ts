import { AdministrativeBoundaryDto } from '@shared/data/dto/administrative-boundary.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ChatbotFindOneItemApiDto {
    uniq_id: string;
    report_uniq_id: string;
    type: string;
    target_type: string;
    region: AdministrativeBoundaryDto;
    department: AdministrativeBoundaryDto;
    municipality: AdministrativeBoundaryDto;
    channels: string[];
    subject: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export type ChatbotFindOneResponseApiDto =
    SimpleResponseDto<ChatbotFindOneItemApiDto>;
