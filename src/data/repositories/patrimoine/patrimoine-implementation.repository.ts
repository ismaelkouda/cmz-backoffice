import { PatrimoineEntity } from './entities/patrimoine-entity';
import { PatrimoineImplementationRepositoryMapper } from './mappers/patrimoine-repository.mapper';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
// @ts-ignore
import appConfig from '../../../assets/config/app-config.json';
import { PatrimoineRepository } from '../../../domain/repositories/patrimoine.repository';
import { PatrimoineModel } from '../../../domain/models/patrimoine.model';

@Injectable({
    providedIn: 'root',
})
export class PatrimoineImplementationRepository extends PatrimoineRepository {

    patrimoineMapper = new PatrimoineImplementationRepositoryMapper();
    timeoutInterval: any;
    baseUrl: any = appConfig.serverUrl;

    constructor(private http: HttpClient) {
        super();
    }

    GetAllPatrimoine(): Observable<PatrimoineModel> {
        return this.http.post<PatrimoineEntity>(`${this.baseUrl}organisation-patrimoine/poste-distributions/all`, {}).pipe(
            map(this.patrimoineMapper.mapFrom));
    }

    CreatePatrimoine(params: {}): Observable<PatrimoineModel> {
        return this.http
            .post<PatrimoineEntity>(`${this.baseUrl}patrimoines`, { params })
            .pipe(map(this.patrimoineMapper.mapFrom));
    }


}
