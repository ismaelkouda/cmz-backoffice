import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()

export class CarteSimApiStateService {
    private subjectListCartesSim = new Subject<void>();
    

  refreshListCartesSim() {
    this.subjectListCartesSim.next();
  }

  setListCartesSim(): Observable<any> {
    return this.subjectListCartesSim.asObservable();
  }
}