import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface FiberConstructorSelectItemApiDto {
    id: string;
    name: string;
}

export type FiberConstructorSelectResponseApiDto = SimpleResponseDto<
    FiberConstructorSelectItemApiDto[]
>;
