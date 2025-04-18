import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EncodingDataService } from './encoding-data.service';
import { StoreCurrentUserService } from './store-current-user.service';

@Injectable({
    providedIn: 'root',
})
export class StorePathsService {
    private readonly STORAGE_KEY = 'paths_data';

    private pathsSubject = new BehaviorSubject<Array<string> | null>(
        this.getStoredPaths()
    );
    public paths$: Observable<Array<string> | null> =
        this.pathsSubject.asObservable();

    constructor(
        private encodingDataService: EncodingDataService,
        private storeCurrentUserService: StoreCurrentUserService
    ) {
        const currentUser = this.storeCurrentUserService.getCurrentUser;
        if (currentUser) {
            this.setPaths(currentUser.paths);
        } else {
            this.setPaths([]);
        }
    }

    private setPaths(paths: Array<string>): void {
        this.encodingDataService.saveData(
            this.STORAGE_KEY,
            JSON.stringify(paths)
        );
        this.pathsSubject.next(paths);
    }

    public get getPaths(): Array<string> | null {
        return this.pathsSubject.value;
    }

    /** Récupère le paths stocké dans this.encodingDataService */
    private getStoredPaths(): Array<string> | null {
        const storedPaths = this.encodingDataService.getData(this.STORAGE_KEY);
        return storedPaths ? JSON.parse(storedPaths) : null;
    }
}
