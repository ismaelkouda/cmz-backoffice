import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { EncodingDataService } from './encoding-data.service';
import { CurrentUser } from '../interfaces/current-user.interface';

@Injectable({
    providedIn: 'root',
})
export class StorePathsService implements OnInit, OnDestroy {
    private readonly STORAGE_KEY = 'paths_data';
    private destroy$ = new Subject<void>();

    private pathsSubject = new BehaviorSubject<Array<string> | null>(
        this.getStoredPaths()
    );
    public paths$: Observable<Array<string> | null> =
        this.pathsSubject.asObservable();

    constructor(
        private encodingDataService: EncodingDataService,
        private encodingService: EncodingDataService
    ) {}

    ngOnInit() {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.setPaths(user?.paths as Array<string>);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setPaths(paths: Array<string>): void {
        this.encodingDataService.saveData(
            this.STORAGE_KEY,
            JSON.stringify(paths),
            true
        );
        this.pathsSubject.next(paths);
    }

    public get getPaths(): Array<string> | null {
        return this.pathsSubject.value;
    }

    /** Récupère le paths stocké dans this.encodingDataService */
    private getStoredPaths(): Array<string> | null {
        return this.encodingDataService.getData(this.STORAGE_KEY);
    }
}
