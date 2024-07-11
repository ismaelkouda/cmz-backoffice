import { Injectable } from '@angular/core';

@Injectable()

export class CarteSimStateService {
    private filterState: Object;
    private tableState: Array<Object>;
    private tableItemSelectedState: Object;
    private parginateState : Object;

    setFilterState(state: {}): void {
        this.filterState = state;
    }

    getFilterState(): any{
        return this.filterState;
    }

    setTableState(state: Array<Object>): void {
        this.tableState = state;
    }

    getTableState(): Array<Object> {
        return this.tableState;
    }

    setTableItemSelectedState(state: Object): void {
        this.tableItemSelectedState = state;
    }

    getTableItemSelectedState(): Object {
        return this.tableItemSelectedState;
    }

    setParginateState(state: {}): void {
        this.parginateState = state;
    }

    getParginateState(): any{
        return this.parginateState;
    }
}