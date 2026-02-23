import { Injectable } from '@angular/core';

import { State } from '@presentation/pages/processing/domain/enums/details/details-state/details-state.enum';
import { ApiState } from '@presentation/pages/processing/infrastructure/enums/details/details-state-api.enum';

@Injectable({ providedIn: 'root' })
export class StateMapper {
    private readonly stateMapping = {
        toApi: {
            [State.PENDING]: ApiState.PENDING,
            [State.IN_PROGRESS]: ApiState.IN_PROGRESS,
            [State.TERMINATED]: ApiState.TERMINATED,
            [State.COMPLETED]: ApiState.COMPLETED,
        },
        fromApi: {
            [ApiState.PENDING]: State.PENDING,
            [ApiState.IN_PROGRESS]: State.IN_PROGRESS,
            [ApiState.TERMINATED]: State.TERMINATED,
            [ApiState.COMPLETED]: State.COMPLETED,
        },
    };

    mapStateToApi(state: State): ApiState {
        return this.stateMapping.toApi[state];
    }

    mapApiToState(apiState: ApiState): State {
        return this.stateMapping.fromApi[apiState];
    }
}
