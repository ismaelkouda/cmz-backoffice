import { Injectable } from '@angular/core';

import { State } from '@presentation/pages/finalization/domain/enums/details/details-state/details-state.enum';
import { ApiState } from '@presentation/pages/finalization/infrastructure/enums/details/details-state-api.enum';

@Injectable({ providedIn: 'root' })
export class StateMapper {
    private readonly stateMapping = {
        toApi: {
            [State.PENDING]: ApiState.PENDING,
            [State.IN_PROGRESS]: ApiState.IN_PROGRESS,
            [State.COMPLETED]: ApiState.COMPLETED,
        },
        fromApi: {
            [ApiState.PENDING]: State.PENDING,
            [ApiState.IN_PROGRESS]: State.IN_PROGRESS,
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
