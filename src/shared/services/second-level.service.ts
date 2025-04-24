import { Injectable } from '@angular/core';
import {
    FirstLevelInterface,
    SecondLevelInterface,
} from '../interfaces/first-level.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SecondLevelService {
    constructor() {}
    public getSecondLevel(
        uuid: string,
        listFirstLevel$: Observable<Array<FirstLevelInterface>>
    ): Observable<Array<SecondLevelInterface>> {
        return listFirstLevel$?.pipe(
            map((listFirstLevel: Array<FirstLevelInterface>) => {
                const firstLevel = listFirstLevel.find(
                    (fl) => fl.uuid === uuid
                );
                return firstLevel ? firstLevel.niveaux_deux : [];
            })
        );
    }
}
