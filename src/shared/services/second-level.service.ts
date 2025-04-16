import { Injectable } from "@angular/core";
import { FirstLevelInterface, SecondLevelInterface } from "../interfaces/first-level.interface";
import { SharedService } from "./shared.service";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class SecondLevelService {
    constructor(private sharedService: SharedService) {}
    public getSecondLevel(uuid: string): Observable<Array<SecondLevelInterface>> {
        this.sharedService.fetchFirstLevel();
        return this.sharedService.getFirstLevel().pipe(
            map((listFirstLevel: Array<FirstLevelInterface>) => {
                const firstLevel = listFirstLevel.find(fl => fl.uuid === uuid);
                return firstLevel ? firstLevel.niveaux_deux : [];
            })
        );
    }
}