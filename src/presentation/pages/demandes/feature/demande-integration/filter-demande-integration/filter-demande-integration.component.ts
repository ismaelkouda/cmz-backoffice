import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { ToastrService } from "ngx-toastr";
import { handle } from "src/shared/functions/api.function";
import { SettingService } from "src/shared/services/setting.service";

@Component({
    selector: "app-filter-demande-integration",
    templateUrl: "./filter-demande-integration.component.html"
})

export class FilterDemandeIntegrationComponent implements OnInit {
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
        this.filter.emit(this.filterForm.value);
    }
}