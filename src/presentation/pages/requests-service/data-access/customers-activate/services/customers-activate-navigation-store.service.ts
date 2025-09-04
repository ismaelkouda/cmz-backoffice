import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';

export abstract class CustomersActivateNavigationStoreService<T> {
    private _state: BehaviorSubject<T>;
    private _updateLock = false;

    /**
     * @param initialState
     */
    constructor(initialState: T) {
        this._state = new BehaviorSubject<T>(initialState);
    }

    get state$(): Observable<T> {
        return this._state.asObservable();
    }

    get state(): T {
        return this._state.getValue();
    }

    protected setState(newState: T, isInternal: boolean = false): void {
        if (this._updateLock && !isInternal) {
            console.warn('Mise à jour bloquée: opération déjà en cours');
            return;
        }

        if (!isInternal) {
            console.log("Mise à jour de l'etat:", newState);

            this._updateLock = true;
        }
        console.log('newState', newState);

        this._state.next(newState);

        if (!isInternal) {
            setTimeout(() => {
                this._updateLock = false;
            }, 50);
        }
    }

    select<K>(selector: (state: T) => K): Observable<K> {
        return this.state$.pipe(map(selector), distinctUntilChanged());
    }
}
