import { Injectable } from '@angular/core';

@Injectable()

export class SuivieTraitementFilterStateService {
    private filterState: {} | null;

    setFilterState(state: {}): void {
        this.filterState = state;
    }

    getFilterState(): {}|null {
        return this.filterState ?? null;
    }
}