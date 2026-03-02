import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ServicesItemDto {
    servicesMonitoringLink: string;
}

export type ServicesResponseDto = SimpleResponseDto<ServicesItemDto>;
