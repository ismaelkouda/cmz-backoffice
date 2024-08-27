import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { ToastrService } from "ngx-toastr";
import { handle } from "src/shared/functions/api.function";
import { SettingService } from "src/shared/services/setting.service";

@Component({
    selector: "app-filter-demande-identification",
    templateUrl: "./filter-demande-identification.component.html"
})

export class FilterDemandeIdentificationComponent implements OnInit {
    private response: any;
    @Output() filter = new EventEmitter<{}>();
    @Input() firstLevelLibelle: string;
    @Input() secondLevelLibelle: string;
    @Input() thirdLevelLibelle: string;
    public filterForm: FormGroup;
    public listStatuts: Array<any>;
    public listUsers: Array<any>;

    constructor(private fb: FormBuilder, public settingService: SettingService,
        private toastrService: ToastrService, private loadingBarService: LoadingBarService) { }

    ngOnInit(): void {
        this.initFilterForm();
        this.GetAllUsers();
    }

    public initFilterForm() {
        // const filterState = this.carteSimStateService.getFilterState();
        this.filterForm = this.fb.group({
            initie_par: [null],
            numero_demande: [null],
            transaction: [null],
            statut: [null],
            date_debut: [null],
            date_fin: [null]
        });;
    }

    async GetAllUsers(): Promise<void> {
        this.response = await handle(() => this.settingService.getAllUsers({}), this.toastrService, this.loadingBarService);
        this.listUsers = this.response.data.map((user: any) => { return { ...user, fullName: `${user.nom} ${user.prenoms}` } });
    }

    public onSubmitFilterForm(): void {
        const filterValues = { ...this.filterForm.value };
    
        // Vérifier si initie_par est un objet et extraire l'identifiant
        if (filterValues.initie_par && typeof filterValues.initie_par === 'object') {
            filterValues.initie_par = filterValues.initie_par.id;
        }
    
        // Émettre les valeurs de filtre
        this.filter.emit(filterValues);
    }
    
}