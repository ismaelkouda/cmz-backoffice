// newspaper.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';

export interface ModalActivityPayloadEntity {
    report_uniq_id: string;
    date?: string;
    type?: string;
    description?: string;
}

export interface ActivityEntity {
    id: string;
    report_uniq_id: string;
    date: string;
    type: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class NewspaperService {
    private readonly envService = inject(EnvService);
    private readonly baseUrl = this.envService.reportUrl;
    private readonly http = inject(HttpClient);
    private readonly endPoint = 'processing-actions';

    // CREATE - POST /processing-actions
    createActivity(payload: ModalActivityPayloadEntity): Observable<any> {
        const formData = new HttpParams()
            .set('report_uniq_id', payload.report_uniq_id)
            .set('date', payload.date || '')
            .set('type', payload.type || '')
            .set('description', payload.description || '');

        return this.http.post(
            `${this.baseUrl}${this.endPoint}/store`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
    }

    // UPDATE - PATCH /processing-actions/{id}/update
    updateActivity(
        id: string,
        payload: ModalActivityPayloadEntity
    ): Observable<any> {
        const formData = new HttpParams()
            .set('date', payload.date || '')
            .set('type', payload.type || '')
            .set('description', payload.description || '');

        return this.http.patch(
            `${this.baseUrl}${this.endPoint}/${id}/update`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
    }

    // DELETE - DELETE /processing-actions/{id}/delete
    deleteActivity(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}${this.endPoint}/${id}/delete`);
    }

    // GET - Récupérer toutes les activités pour un report
    getActivitiesByReport(reportUniqId: string): Observable<ActivityEntity[]> {
        return this.http.get<ActivityEntity[]>(`${this.baseUrl}`, {
            params: { report_uniq_id: reportUniqId },
        });
    }

    // GET - Récupérer une activité spécifique
    getActivityById(id: string): Observable<ActivityEntity> {
        return this.http.get<ActivityEntity>(`${this.baseUrl}/${id}`);
    }
}
