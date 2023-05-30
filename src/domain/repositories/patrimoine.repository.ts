import { Observable } from 'rxjs';

export abstract class PatrimoineRepository {
    abstract GetAllPatrimoine(): Observable<any>;
    abstract CreatePatrimoine(params: {}): Observable<any>

}