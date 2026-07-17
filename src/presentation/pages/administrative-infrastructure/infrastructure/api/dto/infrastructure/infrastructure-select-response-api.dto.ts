import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface InfrastructureSelectItemApiDto {
    id: string;
    name: string;
    description: string;
}

export type InfrastructureSelectResponseApiDto = SimpleResponseDto<
    InfrastructureSelectItemApiDto[]
>;
