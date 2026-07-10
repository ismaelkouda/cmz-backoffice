import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface InfrastructureTypeSelectItemApiDto {
    id: string;
    name: string;
    description: string;
}

export type InfrastructureTypeSelectResponseApiDto = SimpleResponseDto<
    InfrastructureTypeSelectItemApiDto[]
>;
