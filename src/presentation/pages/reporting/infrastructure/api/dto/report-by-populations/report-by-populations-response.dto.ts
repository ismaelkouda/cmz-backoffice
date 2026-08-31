import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ReportByPopulationsItemDto {
    impactsOnPopulations: string;
}

export type ReportByPopulationsResponseDto =
    SimpleResponseDto<ReportByPopulationsItemDto>;
