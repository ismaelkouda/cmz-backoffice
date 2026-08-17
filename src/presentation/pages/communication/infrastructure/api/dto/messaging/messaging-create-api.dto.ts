import { MessagingTypeDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-type.dto';
import { MessagingTargetDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-target.dto';
import { MessagingChannelsDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-channels.dto';

export interface MessagingCreateApiDto {
    report_uniq_id: string;
    type: MessagingTypeDto;
    target_type: MessagingTargetDto;
    region_id: string;
    department_id: string;
    municipality_id: string;
    channels: MessagingChannelsDto[];
    subject: string;
    content: string;
}
