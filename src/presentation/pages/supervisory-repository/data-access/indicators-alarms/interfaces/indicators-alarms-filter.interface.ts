import { AbstractControl } from "@angular/forms";

export interface dataBalanceStatusFilterInterface {
    imsi: AbstractControl<string>;
    iccid: AbstractControl<string>;
    statut: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
    alarme: AbstractControl<string>;
    niveau_un_uuid: AbstractControl<string>;
    niveau_deux_uuid: AbstractControl<string>;
    msisdn: AbstractControl<string>;
    apn: AbstractControl<string>;
    adresse_ip: AbstractControl<string>;
    usage_id: AbstractControl<string>;
    formule_uuid: AbstractControl<string>;
    niveau_trois_uuid: AbstractControl<string>;
    point_emplacement: AbstractControl<string>;
    zone_trafic: AbstractControl<string>;
}

