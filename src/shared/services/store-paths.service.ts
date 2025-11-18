import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CurrentUser } from '@shared/interfaces/current-user.interface';
import { EncodingDataService } from './encoding-data.service';

@Injectable({
    providedIn: 'root',
})
export class StorePathsService implements OnInit, OnDestroy {
    private readonly STORAGE_KEY = 'paths_data';
    private destroy$ = new Subject<void>();

    private pathsSubject = new BehaviorSubject<string[] | null>(
        this.getStoredPaths()
    );
    public paths$: Observable<string[] | null> =
        this.pathsSubject.asObservable();

    constructor(
        private encodingDataService: EncodingDataService,
        private encodingService: EncodingDataService
    ) {}

    ngOnInit() {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.setPaths(user?.paths as string[]);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setPaths(paths: string[]): void {
        this.encodingDataService.saveData(
            this.STORAGE_KEY,
            JSON.stringify(paths),
            true
        );
        this.pathsSubject.next(paths);
    }

    public get getPaths(): string[] | null {
        return this.pathsSubject.value;
    }

    /** Récupère le paths stocké dans this.encodingDataService */
    private getStoredPaths(): string[] | null {
        return this.encodingDataService.getData(this.STORAGE_KEY);
    }
}
