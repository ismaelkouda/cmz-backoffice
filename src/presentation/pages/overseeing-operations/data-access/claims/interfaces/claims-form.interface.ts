import { AbstractControl } from '@angular/forms';

export interface claimsFormInterface {
    motifs: AbstractControl<string>;
    date_remise: AbstractControl<string>;
    piece_jointe_bordereau: AbstractControl<File | null>;
}
