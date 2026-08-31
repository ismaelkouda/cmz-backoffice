import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ReportByEquipmentsItemDto {
    impactsOnEquipments: string;
}

export type ReportByEquipmentsResponseDto =
    SimpleResponseDto<ReportByEquipmentsItemDto>;
