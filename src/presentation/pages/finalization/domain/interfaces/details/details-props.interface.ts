import { ActorEntity } from '@shared/domain/entities/actor.entity';
import { AdministrativeBoundaryEntity } from '@shared/domain/entities/administrative-boundary.entity';
import { ReportLocationEntity } from '@shared/domain/entities/report-location.entity';
import { ReportMediaEntity } from '@shared/domain/entities/report-media.entity';
import { TimestampsEntity } from '@shared/domain/entities/timestamps.entity';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

import { FinalizationState } from '@presentation/pages/finalization/domain/enums/details/details-finalization-state/details-finalization-state.enum';
import { State } from '@presentation/pages/finalization/domain/enums/details/details-state/details-state.enum';
import { DetailsStatus } from '@presentation/pages/finalization/domain/enums/details/details-status/details-status.enum';
import { DetailsTreaterInfo } from '@presentation/pages/finalization/domain/types/details/details-treater-info.type';

export interface DetailsProps {
    type: string;
    uniqId: string;
    reportUniqId: string;
    initiatorPhone: string;
    initiator: ActorEntity | null;
    acknowledgedBy: ActorEntity | null;
    processedBy: ActorEntity | null;
    approvedBy: ActorEntity | null;
    rejectedBy: ActorEntity | null;
    confirmedBy: ActorEntity | null;
    abandonedBy: ActorEntity | null;
    source: ReportSource;
    location: ReportLocationEntity;
    reportType: ReportType;
    operators: TelecomOperator[];
    description: string;
    media: ReportMediaEntity | null;
    treater: DetailsTreaterInfo;
    status: DetailsStatus;
    finalizationState: FinalizationState;
    state: State;
    region: AdministrativeBoundaryEntity | null;
    department: AdministrativeBoundaryEntity | null;
    municipality: AdministrativeBoundaryEntity | null;
    timestamps: TimestampsEntity;
    createdAt: string;
    updatedAt: string;
    reportedAt: string;
    placePhoto: string;
    accessPlacePhoto: string;
    confirmCount: number;
}
