import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BADGE_ETAPE } from '../../constants/badge-etape.constant';
import { BADGE_ETAT } from '../../constants/badge-etat.contant';
import { BADGE_STATUT } from '../../constants/badge-statut.constant';
import { BADGE_TRAITEMENT } from '../../constants/badge-traitement.constant';

@Component({
    selector: 'app-journal',
    templateUrl: './journal.component.html',
    styleUrls: ['./journal.component.scss'],
})
export class JournalComponent implements OnInit {
    public BADGE_ETAT = BADGE_ETAT;
    public BADGE_ETAPE = BADGE_ETAPE;
    public BADGE_TRAITEMENT = BADGE_TRAITEMENT;
    public BADGE_STATUT = BADGE_STATUT;
    @Input() typeJournal!:
        | 'demandes-services'
        | 'importation-sim'
        | 'transactions'
        | 'integration'
        | 'whiteSimCard';
    @Input() transaction!: string;
    @Input() numero_demande!: string;
    response: any;
    listJournal: any[] = [];
    public offset: any;
    public p = 1;
    public displayDefaultJournal = false;
    public displayWhitesimCard = false;
    constructor(private activeModal: NgbActiveModal) {}

    /**
     * @author André ATCHORI
     */

    ngOnInit() {
        if (this.typeJournal === 'whiteSimCard') {
            this.displayWhitesimCard = true;
            this.getAllSimBlancheJournal();
        } else {
            this.displayDefaultJournal = true;
            this.getAllJournal();
        }
    }

    closeModal() {
        this.activeModal.close();
    }

    public getAllJournal() {
        // this.settingsService
        //     .getAllJournal(
        //         {
        //             transaction: this.transaction,
        //             numero_demande: this.numero_demande,
        //         },
        //         this.typeJournal
        //     )
        //     .subscribe({
        //         next: (response) => {
        //             this.listJournal = response['data'];
        //             // .map((data) => {
        //             //   if (data?.statut === StatutTransaction.TARITER) {
        //             //     return {...data,user: data?.intervenant}
        //             //   }else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.ACQUITER)) {
        //             //     return {...data,user: data?.intervenant}
        //             //   }else if (data?.statut === StatutTransaction.CLOTURER) {
        //             //     return {...data,user: data?.demandeur}
        //             //   }else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.EN_ENTENTE)) {
        //             //     return {...data,user: data?.demandeur}
        //             //   }
        //             // });
        //         },
        //         error: (error) => {
        //             this.toastService.error(error.error.message);
        //         },
        //     });
    }

    public getAllSimBlancheJournal(
        dataToSend: object = { reference: this.numero_demande },
        nbrPage = '1'
    ) {
        // this.settingsService
        //     .getAllSimBlancheJournal(dataToSend, nbrPage)
        //     .subscribe({
        //         next: (response) => {
        //             this.listJournal = response['data']?.['data'];
        //             this.pagination = new Pargination(
        //                 response?.data?.p,
        //                 response?.data?.to,
        //                 response?.data?.last_page,
        //                 response?.data?.total,
        //                 response?.data?.per_page,
        //                 response?.data?.current_page,
        //                 (response?.data?.current_page - 1) *
        //                     response.data?.per_page +
        //                     1
        //             );
        //         },
        //         error: (error) => {
        //             this.toastService.error(error.error.message);
        //         },
        //     });
    }
    public onPageChange(event: number): void {
        // this.getAllSimBlancheJournal(
        //     { reference: this.numero_demande },
        //     JSON.stringify(event + 1)
        // );
    }
}
