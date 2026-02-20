import { Injectable } from '@angular/core';

import { ProcessingState } from '@presentation/pages/processing/domain/enums/details/details-processing-state/details-processing-state.enum';
import { ApiProcessingState } from '@presentation/pages/processing/infrastructure/enums/details/details-processing-state-api.enum';

@Injectable({ providedIn: 'root' })
export class ProcessingStateMapper {
    private readonly stateMapping = {
        toApi: {
            [ProcessingState.PENDING]: ApiProcessingState.PENDING,
            [ProcessingState.IN_PROGRESS]: ApiProcessingState.IN_PROGRESS,
            [ProcessingState.TERMINATED]: ApiProcessingState.TERMINATED,
        },
        fromApi: {
            [ApiProcessingState.PENDING]: ProcessingState.PENDING,
            [ApiProcessingState.IN_PROGRESS]: ProcessingState.IN_PROGRESS,
            [ApiProcessingState.TERMINATED]: ProcessingState.TERMINATED,
        },
    };

    mapProcessingStateToApi(state: ProcessingState): ApiProcessingState {
        return this.stateMapping.toApi[state];
    }

    mapApiToProcessingState(
        apiProcessingState: ApiProcessingState
    ): ProcessingState {
        return this.stateMapping.fromApi[apiProcessingState];
    }
}
