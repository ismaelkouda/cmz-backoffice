import { Injectable } from '@angular/core';

import { FinalizationState } from '@presentation/pages/finalization/domain/enums/details/details-finalization-state/details-finalization-state.enum';
import { ApiFinalizationState } from '@presentation/pages/finalization/infrastructure/enums/details/details-finalization-state-api.enum';

@Injectable({ providedIn: 'root' })
export class FinalizationStateMapper {
    private readonly stateMapping = {
        toApi: {
            [FinalizationState.PENDING]: ApiFinalizationState.PENDING,
            [FinalizationState.IN_PROGRESS]: ApiFinalizationState.IN_PROGRESS,
            [FinalizationState.COMPLETED]: ApiFinalizationState.COMPLETED,
        },
        fromApi: {
            [ApiFinalizationState.PENDING]: FinalizationState.PENDING,
            [ApiFinalizationState.IN_PROGRESS]: FinalizationState.IN_PROGRESS,
            [ApiFinalizationState.COMPLETED]: FinalizationState.COMPLETED,
        },
    };

    mapFinalizationStateToApi(state: FinalizationState): ApiFinalizationState {
        return this.stateMapping.toApi[state];
    }

    mapApiToFinalizationState(
        apiFinalizationState: ApiFinalizationState
    ): FinalizationState {
        return this.stateMapping.fromApi[apiFinalizationState];
    }
}
