import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';

export interface HomeFilterPayloadEntity {
    createdFrom: string;
    createdTo: string;
    type: TypeMediaDto[];
    status: boolean | null;
}
