import { AdministrativeBoundaryDto } from '@shared/data/dto/administrative-boundary.dto';
import { MessagingTypeDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-type.dto';
import { MessagingTargetDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-target.dto';
import { MessagingChannelsDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-channels.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MessagingFindOneItemApiDto {
    uniq_id: string;
    report_uniq_id: string;
    type: MessagingTypeDto;
    target_type: MessagingTargetDto;
    region: AdministrativeBoundaryDto;
    department: AdministrativeBoundaryDto;
    municipality: AdministrativeBoundaryDto;
    channels: MessagingChannelsDto[];
    subject: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export type MessagingFindOneResponseApiDto =
    SimpleResponseDto<MessagingFindOneItemApiDto>;
