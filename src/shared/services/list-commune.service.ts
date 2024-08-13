import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class ListCommuneService {
    public getListCommune(commune) {
        const listCommune: any[] = [];
        commune['niveaux_deux'].forEach(element => {
            listCommune.push({...element, fullName: `${element.nom}`})
        });
        return listCommune;
    }
}