import { MessagingTargetDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-target.dto';
import { MessagingChannelsDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-channels.dto';

export interface MessagingFilterApiDto {
    report_id: string;
    search?: string;
    target_type?: MessagingTargetDto;
    region?: string;
    department?: string;
    municipality?: string;
    channels?: MessagingChannelsDto[];
    start_date?: Date;
    end_date?: Date;
}
