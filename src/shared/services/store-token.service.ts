import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EncodingDataService } from './encoding-data.service';
import { TokenInterface } from '../interfaces/token.interface';

@Injectable({
    providedIn: 'root',
})
export class StoreTokenService {
    private readonly STORAGE_KEY = 'token_data';

    private tokenSubject = new BehaviorSubject<TokenInterface | null>(
        this.getStoredToken()
    );
    public token$: Observable<TokenInterface | null> =
        this.tokenSubject.asObservable();

    constructor(private encodingDataService: EncodingDataService) {}

    public setToken(token: TokenInterface): void {
        this.encodingDataService.saveData(
            this.STORAGE_KEY,
            JSON.stringify(token)
        );
        this.tokenSubject.next(token);
    }

    public get getToken(): TokenInterface | null {
        return this.tokenSubject.value;
    }

    public removeToken(): void {
        this.encodingDataService.removeData(this.STORAGE_KEY);
        this.tokenSubject.next(null);
    }

    isAuthenticated(): boolean {
        return this.getToken !== null;
    }

    /** Récupère le token stocké dans this.encodingDataService */
    private getStoredToken(): TokenInterface | null {
        const storedToken = this.encodingDataService.getData(this.STORAGE_KEY);
        return storedToken ? JSON.parse(storedToken) : null;
    }
}
