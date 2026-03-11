import { DetailsEntity as FinalizationEntity } from '@pages/finalization/domain/entities/details/details.entity';
import { DetailsEntity as ProcessingEntity } from '@pages/processing/domain/entities/details/details.entity';
import { DetailsEntity as RequestsEntity } from '@pages/requests/domain/entities/details/details.entity';

export type Actions =
    | RequestsEntity
    | ProcessingEntity
    | FinalizationEntity
    | null;
