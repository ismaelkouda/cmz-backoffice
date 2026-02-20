import { DetailsEntity as FinalizationEntity } from '@presentation/pages/finalization/domain/entities/details/details.entity';
import { DetailsEntity as ProcessingEntity } from '@presentation/pages/processing/domain/entities/details/details.entity';
import { DetailsEntity as RequestsEntity } from '@presentation/pages/requests/domain/entities/details/details.entity';

export type Actions =
    | RequestsEntity
    | ProcessingEntity
    | FinalizationEntity
    | null;
