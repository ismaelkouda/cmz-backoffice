# Définir le chemin de base pour les modules
$baseModulePath = Resolve-Path "src/presentation/pages"

# Vérifier si le répertoire de base existe
if (-not (Test-Path $baseModulePath)) {
    Write-Host "❌ Le répertoire de base '$baseModulePath' n'existe pas."
    exit
}

# Se déplacer dans le répertoire de base
Set-Location $baseModulePath

# Demander à l'utilisateur ce qu'il souhaite faire
$includeMainModule = Read-Host "Créer un module principal (NEW) | Utiliser un module principal existant (EXIST) | Annuler (NULL) ?"

if ($includeMainModule -eq "NEW") {
    # Créer un nouveau module principal
    $moduleName = (Read-Host "Entrez le nom du module principal (ex: comptabilite)").Trim()

    # Générer le module Angular avec le routage
    ng g module "$moduleName" --routing
    if ($?) {
        Write-Host "✅ Module principal '$moduleName' généré avec succès dans '$baseModulePath'"
        # Mettre à jour le chemin complet du module
        $fullModulePath = Join-Path -Path $baseModulePath -ChildPath $moduleName
        # Se déplacer dans le répertoire de base
        Set-Location $fullModulePath
    }
    else {
        Write-Host "❌ Erreur lors de la génération du module principal '$moduleName'."
        exit
    }

}
elseif ($includeMainModule -eq "EXIST") {
    # Utiliser un module principal existant
    $moduleName = (Read-Host "Entrez le nom du module principal existant").Trim()

    # Construire le chemin complet du module
    $fullModulePath = Join-Path -Path $baseModulePath -ChildPath $moduleName
    # Vérifier si le dossier existe
    if (Test-Path $fullModulePath) {
        Set-Location $fullModulePath
        Write-Host "✅ Module principal '$moduleName' sélectionné."
    }
    else {
        Write-Host "❌ Le dossier '$fullModulePath' n'existe pas."
        Write-Host "Dossiers disponibles :"

        # Lister les dossiers disponibles
        $availableFolders = Get-ChildItem -Path $baseModulePath -Directory
        $availableFolders | ForEach-Object { $i = 1 } { Write-Host "$i. $($_.Name)"; $i++ }

        # Demander à l'utilisateur de sélectionner un dossier
        $selectedIndex = Read-Host "Veuillez sélectionner un dossier en entrant son numéro (ou appuyez sur Entrée pour annuler)"

        if ($selectedIndex -and $selectedIndex -ge 1 -and $selectedIndex -le $availableFolders.Count) {
            # Si l'utilisateur a sélectionné un dossier valide
            $selectedFolder = $availableFolders[$selectedIndex - 1].Name
            $fullModulePath = Join-Path -Path $baseModulePath -ChildPath $selectedFolder
            Set-Location $fullModulePath
            Write-Host "✅ Dossier sélectionné : '$fullModulePath'"
        }
        else {
            # Si l'utilisateur annule ou sélectionne un dossier invalide
            Write-Host "❌ Aucun dossier valide sélectionné. Opération annulée."
            exit
        }
    }

}
else {
    # Annuler l'opération
    Write-Host "❌ Opération annulée."
    exit
}

# Fonction pour créer un sous-module dans une structure existante
function Create-SubModule {
    param (
        [string]$subModuleName
    )

    # Chemin des dossiers existants
    $dataAccessPath = Join-Path -Path $fullModulePath -ChildPath "data-access/$subModuleName"
    $featurePath = Join-Path -Path $fullModulePath -ChildPath "feature/$subModuleName"
    $uiPath = Join-Path -Path $fullModulePath -ChildPath "ui/$subModuleName"

    # Créer le module data-access
    if (-not (Test-Path $dataAccessPath)) {
        
        New-Item -ItemType Directory -Path "$dataAccessPath/services" -Force | Out-Null
        ng g service "data-access/$subModuleName/services/$subModuleName-api"
        
        New-Item -ItemType Directory -Path "$dataAccessPath/interfaces" -Force | Out-Null
        ng generate interface "data-access/$subModuleName/interfaces/$subModuleName"
        ng generate interface "data-access/$subModuleName/interfaces/$subModuleName-filter"

        New-Item -ItemType Directory -Path "$dataAccessPath/enums" -Force | Out-Null
        New-Item -ItemType File -Path "$dataAccessPath/enums/$subModuleName-endpoint.enum.ts"
        New-Item -ItemType File -Path "$dataAccessPath/enums/$subModuleName-status.enum.ts"
        
        New-Item -ItemType Directory -Path "$dataAccessPath/constants" -Force | Out-Null
        New-Item -ItemType File -Path "$dataAccessPath/constants/$subModuleName-table.constant.ts"

        Write-Host "✅ Module data-access pour '$subModuleName' généré avec succès."
    }
    else {
        Write-Host "⚠️ Le dossier '$dataAccessPath/interface' existe déjà."
    }

    $interfaceContent = @" 
import { Paginate } from "../../../../../../shared/interfaces/paginate";

export interface ${subModuleName}Interface {
    id: number;
    reference: string;
    description: string;
    statut: string;
    premier_numero: string;
    dernier_numero: string;
    nb_numeros_disponibles: number;
    nb_numeros_utilises: number;
    nb_numeros_total: number;
    taux_utilisation: number;
    created_at: string;
    updated_at: string;
}

export interface ${subModuleName}GlobalStatsInterface {
    total: number;
    total_attribues: number;
    total_disponibles: number;
    total_reserves: number;
    total_lots: number;
    pourcentage_attribues: number;
    pourcentage_disponibles: number;
    pourcentage_reserves: number;
    pourcentage_lots: number;
    data: Paginate<${subModuleName}Interface>;
}

export interface ${subModuleName}ApiResponseInterface {
  error: boolean;
  message: string;
  data: ${subModuleName}GlobalStatsInterface;
}
"@
    Add-Content "$dataAccessPath/interfaces/$subModuleName.interface.ts" -value $interfaceContent

    $filterInterfaceContent = @" 
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

"@
    Add-Content "$dataAccessPath/interfaces/$subModuleName-filter.interface.ts" -value $filterInterfaceContent

    $tableConstantContent = @" 
export const ${subModuleName}TableConstant = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'numero_demande', header: 'N° Dossier', class: "text-center", width: "12rem" },
        { field: 'nb_demande_soumises', header: '# Lignes', class: "text-center" },
        { field: 'nb_demande_traitees', header: '# Traitées', class: "text-center" },
        { field: 'statut', header: 'Etape', class: "text-center" },
        { field: 'traitement', header: 'Etat', class: "text-center" },
        { field: 'updated_at', header: 'Date Etat', class: "text-center", width: "12rem" },
        { field: 'demandeur', header: 'Demandeur', class: "text-center", width: "20rem" },
        { field: '', header: 'Actions', class: "text-center", width: "20rem" }
    ],
    globalFilterFields: ['created_at','numero_demande','nb_demande_soumises','nb_demande_traitees','nb_demande_identifiees','statut','traitement', 'updated_at','demandeur']
}
"@
    Add-Content "$dataAccessPath/constants/$subModuleName-table.constant.ts" -value $tableConstantContent

    $endpointEnumContent = @" 
export const enum ${subModuleName}EndpointEnum {
    DEMANDE_SERVICE_ALL = 'patrimoine-sim/demandes-services/all?page={page}',
}
"@
    Add-Content "$dataAccessPath/enums/$subModuleName-endpoint.enum.ts" -value $endpointEnumContent

    $apiServiceContent = @" 
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { ${subModuleName}ApiResponseInterface, ${subModuleName}Interface } from '../interfaces/sms-balance-status.interface';
import { ${subModuleName}EndpointEnum } from '../enums/${subModuleName}-endpoint.enum';
import { ${subModuleName}FilterInterface } from '../interfaces/${subModuleName}-filter.interface';

@Injectable()

export class ${subModuleName}ApiService {
    private ${subModuleName}Subject = new BehaviorSubject<Array<${subModuleName}Interface>>([]);
    private ${subModuleName}Pagination = new BehaviorSubject<Paginate<${subModuleName}Interface>>({} as Paginate<${subModuleName}Interface>);
    private ${subModuleName}Selected = new BehaviorSubject<${subModuleName}Interface>({} as ${subModuleName}Interface);
    private loading${subModuleName}Subject = new BehaviorSubject<boolean>(false);
    private dataFilter${subModuleName}Subject = new BehaviorSubject<${subModuleName}FilterInterface>({} as ${subModuleName}FilterInterface);
    private dataNbrPage${subModuleName}Subject = new BehaviorSubject<string>('1');
    private apiResponse${subModuleName}Subject = new BehaviorSubject<${subModuleName}ApiResponseInterface>({} as ${subModuleName}ApiResponseInterface);

    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.reportUrl;
    }

            /*********************Méthode pour récupérer la liste ${subModuleName}*************** */
    fetch${subModuleName}(data: ${subModuleName}FilterInterface, nbrPage: string = '1'): void {
        if (this.loading${subModuleName}Subject.getValue()) return;
        this.loading${subModuleName}Subject.next(true);
        const url: string = ${subModuleName}EndpointEnum.DEMANDE_SERVICE_ALL.replace('{page}', nbrPage);

        this.http
            .post<Object>(this.BASE_URL+url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const ${subModuleName} = response?.['data']?.data;
                    this.${subModuleName}Subject.next(${subModuleName});
                    this.${subModuleName}Pagination.next(response?.['data']);
                    this.apiResponse${subModuleName}Subject.next(response);
                    this.dataFilter${subModuleName}Subject.next(data);
                    this.dataNbrPage${subModuleName}Subject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching ${subModuleName}', error);
                    return of([]);
                }),
                finalize(() => this.loading${subModuleName}Subject.next(false))
            )
            .subscribe();
    }

    get${subModuleName}(): Observable<Array<${subModuleName}Interface>> {
        return this.${subModuleName}Subject.asObservable();
    }
    get${subModuleName}Pagination(): Observable<Paginate<${subModuleName}Interface>> {
        return this.${subModuleName}Pagination.asObservable();
    }
    isLoading${subModuleName}(): Observable<boolean> {
        return this.loading${subModuleName}Subject.asObservable();
    }
    getDataFilter${subModuleName}(): Observable<Object> {
        return this.dataFilter${subModuleName}Subject.asObservable();
    }
    getDataNbrPage${subModuleName}(): Observable<string> {
        return this.dataNbrPage${subModuleName}Subject.asObservable();
    }
    getApiResponse${subModuleName}(): Observable<Object> {
        return this.apiResponse${subModuleName}Subject.asObservable();
    }
    get${subModuleName}Selected(): Observable<${subModuleName}Interface> {
        return this.${subModuleName}Selected.asObservable();
    }
    set${subModuleName}Selected(${subModuleName}: ${subModuleName}Interface): void {
        this.${subModuleName}Selected.next(${subModuleName});
    }
}
"@
    Clear-Content "$dataAccessPath/services/$subModuleName-api.service.ts"
    Add-Content "$dataAccessPath/services/$subModuleName-api.service.ts" -value $apiServiceContent
    

    # Créer le module feature
    if (-not (Test-Path $featurePath)) {

        New-Item -ItemType Directory -Path "$featurePath/filter-$subModuleName" -Force
        ng g component "feature/$subModuleName/filter-$subModuleName"

        $filterHtmlContent = @"
<form [formGroup]="formFilter" (ngSubmit)="onSubmitFilterForm()">
    <div class="d-flex gap-1">
        <div class="width-100">
            <label><b>{{'STATUS' | translate}}&nbsp;{{'ALARM' | translate}}</b></label>
            <p-select formControlName="alarme" [options]="listAlarms" [showClear]="true" [filter]="true"
                placeholder="{{ 'SELECT' | translate }} {{ 'ALARM' | translate }}"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>

        <div class="width-100">
            <label><b>{{ firstLevelLibel }}</b></label>
            <p-select formControlName="niveau_un_uuid" [options]="listFirstLevel$ | async" optionValue="uuid"
                optionLabel="nom" filterBy="nom" [showClear]="true" [filter]="true"
                placeholder="{{ 'SELECT' | translate }} {{firstLevelLibel}}"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>

        <div class="width-100">
            <label><b>{{ secondLevelLibel }}</b></label>
            <p-select formControlName="niveau_deux_uuid" [options]="listSecondLevel" optionValue="uuid"
                optionLabel="nom" filterBy="nom" [showClear]="true" [filter]="true"
                placeholder="{{ 'SELECT' | translate }} {{secondLevelLibel}}"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>

        <div class="width-80">
            <label><b>{{'MSISDN' | translate}}</b></label>
            <input formControlName="msisdn" type="text" pInputText placeholder="{{'MSISDN' | translate}}"
                [style]="{ minWidth: '100%' }" />
        </div>

        <div class="width-80">
            <label><b>{{'IMSI' | translate}}</b></label>
            <input formControlName="imsi" type="text" pInputText placeholder="{{'IMSI' | translate}}"
                [style]="{ minWidth: '100%' }" />
        </div>

        <div class="width-80">
            <label><b>{{'APN' | translate}}</b></label>
            <p-select formControlName="apn" [options]="listApn$ | async" optionValue="apn" optionLabel="apn"
                filterBy="apn" [showClear]="true" [filter]="true"
                placeholder="{{ 'SELECT' | translate }} {{ 'APN' | translate }}"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>

        <div class="width-80">
            <label><b>{{'IP_ADDRESS' | translate}}</b></label>
            <input formControlName="adresse_ip" type="text" pInputText placeholder="{{'IP_ADDRESS' | translate}}"
                [style]="{ minWidth: '100%' }" />
        </div>

        <div class="filter-button" *ngIf="!secondFilter">
            <button pButton pRipple type="submit" class="p-button-success" icon="pi pi-filter"></button>
        </div>

        <div class="filter-button">
            <button *ngIf="!secondFilter" (click)="showSecondFilter()" pButton pRipple class="p-button-dark"
                icon="pi pi-plus">
            </button>
            <button *ngIf="secondFilter" (click)="showSecondFilter()" pButton pRipple class="p-button-dark"
                icon="pi pi-minus">
            </button>
        </div>

    </div>

    <br *ngIf="secondFilter">


    <div class="d-flex gap-1" *ngIf="secondFilter" style="padding-top: 0.7rem">

        <div class="width-100">
            <label><b>{{'USAGE' | translate}}</b></label>
            <p-select formControlName="usage_id" [options]="listUsages$ | async" optionLabel="nom_usage"
                [showClear]="true" placeholder="{{ 'SELECT' | translate }} {{ 'USAGE' | translate }}" optionValue="uuid"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>
        <div class="width-100">
            <label><b>{{'DESTINATION_FORMULA' | translate}}</b></label>
            <p-select formControlName="formule_uuid" [options]="listFormulas$ | async" optionLabel="nom"
                [showClear]="true" placeholder="{{ 'SELECT' | translate }} {{ 'ALARM' | translate }}" optionValue="uuid"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>
        <div class="width-100">
            <label><b>{{ thirdLevelLibel }}</b></label>
            <p-select formControlName="niveau_trois_uuid" [options]="listThirdLevel$ | async" optionValue="uuid"
                optionLabel="nom" filterBy="nom" [showClear]="true" [filter]="true"
                placeholder="{{ 'SELECT' | translate }} {{ thirdLevelLibel }}"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>
        <div class="width-100">
            <label><b>{{ 'NAME_LOCATION' | translate }}</b></label>
            <input formControlName="point_emplacement" type="text" pInputText
                placeholder="{{'NAME_LOCATION' | translate}}" [style]="{ minWidth: '100%' }" />
        </div>
        <div class="width-100">
            <label><b>{{ 'TRAFFIC_ZONE' | translate }}</b></label>
            <input formControlName="zone_trafic" type="text" pInputText
                placeholder="{{'TRAFFIC_ZONE' | translate}}" [style]="{ minWidth: '100%' }" />
        </div>
        <div class="col-md-2">
            <label><b>{{'START_DATE' | translate}}</b></label>
            <p-datepicker formControlName="date_debut" [showIcon]="true" [placeholder]="'JJ-MM-AAAA'"
                dateFormat="dd-mm-yy">
            </p-datepicker>
        </div>
        <div class="col-md-2">
            <label><b>{{'END_DATE' | translate}}</b></label>
            <p-datepicker formControlName="date_fin" [showIcon]="true" placeholder="JJ-MM-AAAA" dateFormat="dd-mm-yy">
            </p-datepicker>
        </div>
        <div class="filter-button">
            <button pButton pRipple type="submit" class="p-button-success" icon="pi pi-filter"></button>
        </div>

    </div>
</form>
"@
        Clear-Content "$featurePath/filter-$subModuleName/filter-$subModuleName.component.html"
        Add-Content "$featurePath/filter-$subModuleName/filter-$subModuleName.component.html" -Value $filterHtmlContent

        $filterTsContent = @"
import { SecondLevelService } from '../../../../../../shared/services/second-level.service';
import { Component, Input, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { MappingService } from '../../../../../../shared/services/mapping.service';
import { Observable } from 'rxjs';
import { FormulasInterface } from '../../../../../../shared/interfaces/formulas.interface';
import { FirstLevelInterface, SecondLevelInterface } from '../../../../../../shared/interfaces/first-level.interface';
import { ThirdLevelInterface } from '../../../../../../shared/interfaces/third-level.interface';
import { UsageInterface } from '../../../../../../shared/interfaces/usage.interface';
import { ApnInterface } from '../../../../../../shared/interfaces/apn.interface';
import { TypeAlarme } from '../../../../../../shared/enum/TypeAlarme.enum';
import { ${subModuleName}FilterInterface } from '../../../data-access/${subModuleName}/interfaces/${subModuleName}-filter.interface';
import { TranslateService } from '@ngx-translate/core';

    @Component({
        selector: 'app-filter-$subModuleName',
        templateUrl: `./filter-$subModuleName.component.html`,
        styles: [`:host ::ng-deep { .p-datepicker { position: relative; display: inline-flex; max-width: 100%; width: 21rem !important; } }`]
    })

    export class Filter${subModuleName}Component {

    @Input() 'listFormulas$': Observable<Array<FormulasInterface>>;
    @Input() 'listFirstLevel$': Observable<Array<FirstLevelInterface>>;
    @Input() 'listThirdLevel$': Observable<Array<ThirdLevelInterface>>;
    @Input() 'listUsages$': Observable<Array<UsageInterface>>;
    @Input() 'listApn$': Observable<Array<ApnInterface>>;
    @Input() listStep$subModuleName : Array<T_BADGE_ETAPE>;
    @Input() listState$subModuleName : Array<T_BADGE_ETAT>;
    @Input() listAlarms: Array<TypeAlarme> = [];
    @Input() filterData: ${subModuleName}FilterInterface;
    
    @Output() filter = new EventEmitter<${subModuleName}FilterInterface>();

    public listSecondLevel: Array<SecondLevelInterface>|void;
    public formFilter: FormGroup;

    public firstLevelLibel: string;
    public secondLevelLibel: string;
    public thirdLevelLibel: string;

    public secondFilter: boolean = false;

    constructor(private toastService: ToastrService, private fb: FormBuilder,
        private mappingService: MappingService, private translate: TranslateService,
        private secondLevelService: SecondLevelService) {
        this.initFormFilter();
        this.firstLevelLibel = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibel = this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibel = this.mappingService.structureGlobale?.niveau_3;
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group<${subModuleName}FilterInterface>({
            imsi: new FormControl<string>(this.filterData?.["imsi"], { nonNullable: true,
                validators: [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)],
            }),
            iccid: new FormControl<string>(this.filterData?.["iccid"], { nonNullable: true }),
            statut: new FormControl<string>(this.filterData?.["statut"], { nonNullable: true }),
            date_debut: new FormControl<string>(this.filterData?.["date_debut"], { nonNullable: true }),
            date_fin: new FormControl<string>(this.filterData?.["date_fin"], { nonNullable: true }),
            alarme: new FormControl<string>(this.filterData?.["alarme"], { nonNullable: true }),
            niveau_un_uuid: new FormControl<string>(this.filterData?.["niveau_un_uuid"], { nonNullable: true }),
            niveau_deux_uuid: new FormControl<string>(this.filterData?.["niveau_deux_uuid"], { nonNullable: true }),
            msisdn: new FormControl<string>(this.filterData?.["msisdn"], { nonNullable: true }),
            apn: new FormControl<string>(this.filterData?.["apn"], { nonNullable: true }),
            adresse_ip: new FormControl<string>(this.filterData?.["adresse_ip"], { nonNullable: true }),
            usage_id: new FormControl<string>(this.filterData?.["usage_id"], { nonNullable: true }),
            formule_uuid: new FormControl<string>(this.filterData?.["formule_uuid"], { nonNullable: true }),
            niveau_trois_uuid: new FormControl<string>(this.filterData?.["niveau_trois_uuid"], { nonNullable: true }),
            point_emplacement: new FormControl<string>(this.filterData?.["point_emplacement"], { nonNullable: true }),
            zone_trafic: new FormControl<string>(this.filterData?.["zone_trafic"], { nonNullable: true }),
        });

        this.formFilter.get("imsi")?.valueChanges.subscribe((value) => {
            if (value && value.length > 15) {
                this.formFilter.get("imsi")?.setValue(value.slice(0, 15), { emitEvent: false });
            }
        });

        this.formFilter.get("msisdn")?.valueChanges.subscribe((value) => {
            if (value && value.length > 10) {
                this.formFilter.get("msisdn")?.setValue(value.slice(0, 10), { emitEvent: false });
            }
        });
        this.formFilter?.get('niveau_un_uuid')?.valueChanges.subscribe(
            this.fetchSecondLevel.bind(this)
        );
    }

    fetchSecondLevel(uuid: string) {
        this.listSecondLevel = this.secondLevelService.getSecondLevel(uuid);
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }

    public onSubmitFilterForm(): void {
        const date_debut = moment(this.formFilter.get("date_debut")?.value).isValid()
            ? this.formFilter.get("date_debut")?.value : null;
        const date_fin = moment(this.formFilter.get("date_fin")?.value).isValid()
            ? this.formFilter.get("date_fin")?.value : null;

        if (date_debut && date_fin && moment(date_debut).isAfter(moment(date_fin))) {
            const INVALID_DATE_RANGE = this.translate.instant('INVALID_DATE_RANGE');
            this.toastService.error(INVALID_DATE_RANGE);
            return;
        }

        const filterData = {
            ...this.formFilter.value,
            date_debut: date_debut ? moment(date_debut).format('YYYY-MM-DD') : '',
            date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : ''
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.success(translatedMessage);
        }
    }

}
"@
        Clear-Content "$featurePath/filter-$subModuleName/filter-$subModuleName.component.ts"
        Add-Content "$featurePath/filter-$subModuleName/filter-$subModuleName.component.ts" -Value $filterTsContent


        New-Item -ItemType Directory -Path "$featurePath/table-$subModuleName" -Force
        ng g component "feature/$subModuleName/table-$subModuleName"

        # Ajouter le code HTML au fichier table.component.html
        $tableHtmlContent = @"
    <p-table #dt [value]="list${subModuleName}$ | async" [rowHover]="true" dataKey="id" selectionMode="single" 
        [(selection)]="${subModuleName}Selected" [rows]="(pagination$ | async)?.per_page"
        [globalFilterFields]="table.globalFilterFields">
        <ng-template pTemplate="caption">
            <div class="d-flex justify-content-between">
                <app-table-title [count]="(pagination$ | async)?.total" [perPage]="(pagination$ | async)?.per_page"
                    [page]="(pagination$ | async)?.currentPage" [totalPage]="(pagination$ | async)?.last_page">
                </app-table-title>
                <div class="d-flex gap-2 align-items-center">
                    <div class="d-flex gap-2">
                        <button pButton pRipple [label]="'SIMPLE_DEMAND' | translate"
                            icon="pi pi-plus" class="p-button-success margin-right-5"
                            (click)="handleAction({'data': null, 'action': 'simple-add-$subModuleName', 'view': 'page'})">
                        </button>
                        <app-table-button-header (refresh)="pageCallback()" (export)="onExportExcel()"
                            [disabledButtonExport]="(list${subModuleName}$ | async)?.length === 0" [labelOther]="'MASS_DEMAND' | translate"
                            [colorOther]="'dark'" [hiddenButtonOther]="false" [iconOther]="'pi pi-plus'"
                            (other)="handleAction({'data': null, 'action': 'mass-add-$subModuleName', 'view': 'page'})">
                        </app-table-button-header>
                    </div>
                    <div>
                        <app-search-table [dt]="dt"></app-search-table>
                    </div>
                </div>
            </div>
        </ng-template>
        <ng-template pTemplate="header">
            <tr>
                <th *ngFor="let col of table.cols" [class]="col.class" [ngStyle]="{'width': col.width}">
                    <ng-container [ngSwitch]="col.header">
                        <ng-container *ngSwitchCase="'Date / Heure'">
                            {{ 'DATE_TIME' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'N° Dossier'">
                            {{ 'NUMBER_FOLDER' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'# Lignes'">
                            {{ 'NUMBER_LINES' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'# Traitées'">
                            {{ 'NUMBER_TREATED' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'# Identifiées'">
                            {{ 'NUMBER_IDENTIFIED' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'Etape'">
                            {{ 'STEP' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'Etat'">
                            {{ 'STATE' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'Date Etat'">
                            {{ 'UPDATED_DATE' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'Demandeur'">
                            {{ 'APPLICANT' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchDefault>
                            {{col.header}}
                        </ng-container>
                    </ng-container>
                </th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowIndex="rowIndex" let-item>
            <tr [pSelectableRow]="item">
                <td *ngFor="let col of table.cols" [class]="col.class" [ngStyle]="{'width': col.width}">
                    <ng-container [ngSwitch]="col.header">
                        <ng-container *ngSwitchCase="'#'">
                            {{ rowIndex + pagination?.current_page }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'N° Commande'">
                            <span (click)="copyToClipboard(item?.[col.field])">
                                {{ item?.[col.field] }}
                            </span>
                        </ng-container>
                        <ng-container *ngSwitchCase="'Etape'">
                            <span [ngStyle]="{ 'font-size': '16px' }" [class]="'badge '+getStep${subModuleName}Badge(item)">
                                {{ item?.[col.field] }}
                            </span>
                        </ng-container>
                        <ng-container *ngSwitchCase="'Etat'">
                            <span [ngStyle]="{ 'font-size': '16px' }" [class]="'badge '+getState${subModuleName}Badge(item)">
                                {{ item?.[col.field] }}
                            </span>
                        </ng-container>
                        <ng-container *ngSwitchCase="'Date Etat'">
                            {{ item?.[col.field] }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'Actions'">
                            <button pButton [ngClass]="getTreatmentButtonOpen${subModuleName}Style(item)?.class"
                                [icon]="getTreatmentButtonOpen${subModuleName}Style(item)?.icon" tooltipPosition="top"
                                [pTooltip]="getTreatmentButtonOpen${subModuleName}Style(item)?.['tooltip']"
                                (click)="handleAction({'data': item, 'action': 'open-folder-${subModuleName}', 'view': 'page'})">
                            </button>&nbsp;
                            <button pButton [ngClass]="getTreatmentButtonView${subModuleName}Style(item)?.class"
                                [icon]="getTreatmentButtonView${subModuleName}Style(item)?.icon" tooltipPosition="top"
                                [pTooltip]="getTreatmentButtonView${subModuleName}Style(item)?.['tooltip']"
                                (click)="handleAction({'data': item, 'action': 'view-${subModuleName}', 'view': 'modal'})">
                            </button>&nbsp;
                            <button pButton [ngClass]="getTreatmentButtonPaiement${subModuleName}Style(item)?.class"
                                [icon]="getTreatmentButtonPaiement${subModuleName}Style(item)?.icon" tooltipPosition="top"
                                [pTooltip]="getTreatmentButtonPaiement${subModuleName}Style(item)?.['tooltip']"
                                (click)="handleAction({'data': item, 'action': 'invoice-${subModuleName}', 'view': 'page'})">
                            </button>&nbsp;
                            <button pButton icon="pi pi-book" class="p-button-primary" tooltip="Journal du ${subModuleName}"
                                (click)="handleAction({'data': item, 'action': 'journal-${subModuleName}', 'view': 'modal'})">
                            </button>
                        </ng-container>
                        <ng-container *ngSwitchDefault>
                            {{item?.[col.field]}}
                        </ng-container>
                    </ng-container>
                </td>
            </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
            <tr *ngIf="(list${subModuleName}$ | async)?.length <= 0 && !spinner">
                <td class="posRelative" colspan="15">
                    <span class="posCenter"> {{ 'NO_DATA_FOUND' | translate }} </span>
                </td>
            </tr>
            <tr *ngIf="spinner">
                <td class="posRelative" colspan="15">
                    <p-progressSpinner class="posCenter" [style]="{ width: '40px', height: '50px' }"
                        styleClass="custom-spinner" strokeWidth="8" fill="#EEEEEE" animationDuration=".5s">
                    </p-progressSpinner>
                </td>
            </tr>
        </ng-template>

    </p-table>

    <p-dialog header="[{{ 'TRACKING_PROCESSING' | translate }}] {{ 'DEMAND' | translate }} [{{${subModuleName}Selected?.numero_demande}}]"
        [(visible)]="visibleForm$subModuleName" (onHide)="hideDialog()" [modal]="true" [closable]="true"
        [style]="{'width': '100%', 'min-height': '100%'}" [responsive]="true" [maximizable]="true" 
        [draggable]="false"
        [resizable]="true">

        <ng-template pTemplate="content">
            <app-form-folder 
                [${subModuleName}Selected]="${subModuleName}Selected" 
                [typeTreatment]="typeTreatment"
                (visibleForm$subModuleName)="hideDialog()">
            </app-form-folder>
        </ng-template>

    </p-dialog>
"@
        Clear-Content "$featurePath/table-$subModuleName/table-$subModuleName.component.html"
        Add-Content "$featurePath/table-$subModuleName/table-$subModuleName.component.html" -Value $tableHtmlContent

    


        # Ajouter le code TypeScript au fichier table.component.ts
        $tableTsContent = @"
    import { ModalParams } from './../../../../../../shared/constants/modalParams.contant';
    import { JournalComponent } from './../../../../../../shared/components/journal/journal.component';
    import { Component, Input, Output, EventEmitter } from '@angular/core';
    import { ToastrService } from 'ngx-toastr';
    import { ClipboardService } from 'ngx-clipboard';
    import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
    import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
    import { SharedDataService } from '../../../../../../shared/services/shared-data.service';
    import { SupervisionOperationService } from '../../../data-access/supervision-operation.service';
    import { BADGE_ETAT } from '../../../../../../shared/constants/badge-etat.contant';
    import { BADGE_ETAPE } from '../../../../../../shared/constants/badge-etape.constant';
    import { TypeTraitement } from '../../../data-access/traitement';

    type Action = PageAction | ModalAction;
    type PageAction = { data: ${subModuleName}Interface, action: 'open-folder-$subModuleName' | 'invoice-$subModuleName' | 'mass-edit-$subModuleName' | 'mass-add-$subModuleName' | 'simple-add-$subModuleName', view: 'page' };
    type ModalAction = { data: ${subModuleName}Interface, action: 'view-$subModuleName' | 'journal-$subModuleName', view: 'modal' };
    const INIT_TYPE_TRAITEMENT: Treatment$subModuleName = { module: "$moduleName", abandonner: false, modifier: false, visualiser: false, cloturer: false}
    type TYPE_COLOR_ETAPE_BADGE = 'badge-dark' | 'badge-warning' | 'badge-info' | 'badge-success';
    type TYPE_COLOR_ETAT_BADGE = 'badge-warning' | 'badge-dark' | 'badge-success' | 'badge-danger';

    @Component({
        selector: 'app-table-$subModuleName',
        templateUrl: './table-$subModuleName.component.html'
    })

    export class Table${subModuleName}Component {

        @Input() (list${subModuleName}$): Array<${subModuleName}Interface>;
        @Input() ${subModuleName}Selected: ${subModuleName}Interface;
        @Input() 'pagination$': Observable<Paginate<${subModuleName}Interface>>;
        @Output() interfaceUser = new EventEmitter<any>();
        public typeTreatment: Treatment$subModuleName = INIT_TYPE_TRAITEMENT;
        public visibleFormDossier = false;

        public readonly table: TableConfig = ${subModuleName}TableConstant;
        public readonly BADGE_STEP = BADGE_ETAPE;
        public readonly BADGE_STATE = BADGE_ETAT;

        constructor(private toastService: ToastrService, private clipboardService: ClipboardService, private ngbModal: NgbModal,
            private sharedService: SharedService, private tableExportExcelFileService: TableExportExcelFileService,
            private translate: TranslateService) { }

        public onExportExcel(): void {
            this.tableExportExcelFileService.exportAsExcelFile(this.list${subModuleName}, this.table, "List_$subModuleName");
        }

        public pageCallback() {
            this.${subModuleName}ApiService.fetch${subModuleName}({} as ${subModuleName}FilterInterface);
        }

        public copyToClipboard(data: string): void {
            const translatedMessage = this.translate.instant('COPIED_TO_THE_CLIPBOARD');
            this.toastService.success(translatedMessage);
            this.clipboardService.copyFromContent(data);
        }

        getStep${subModuleName}Badge(selected${subModuleName}?: { statut: T_BADGE_ETAPE; }): TYPE_COLOR_ETAPE_BADGE {
            if (!selected${subModuleName} || !selected${subModuleName}.statut) {
            return 'badge-dark';
            }

            const etapeMap: Record<T_BADGE_ETAPE, TYPE_COLOR_ETAPE_BADGE> = {
            [BADGE_ETAPE.SOUMISSION]: 'badge-dark',
            [BADGE_ETAPE.TRAITEMENT]: 'badge-warning',
            [BADGE_ETAPE.FINALISATEUR]: 'badge-info',
            [BADGE_ETAPE.CLOTURE]: 'badge-success',
            };
            return etapeMap[selected${subModuleName}.statut] || 'badge-dark';
        }


        getState${subModuleName}Badge(selected${subModuleName}?: { statut?: T_BADGE_ETAPE; traitement?: T_BADGE_ETAT }): TYPE_COLOR_ETAT_BADGE {
            if (!selected${subModuleName} || !selected${subModuleName}.statut || !selected${subModuleName}.traitement) {
            return 'badge-dark';
            }

            const stateMap: Partial<Record<T_BADGE_ETAPE, Partial<Record<T_BADGE_ETAT, TYPE_COLOR_ETAT_BADGE>>>> = {
            [BADGE_ETAPE.SOUMISSION]: {
                [BADGE_ETAT.EN_ATTENTE]: 'badge-dark',
                [BADGE_ETAT.PARTIEL]: 'badge-warning',
                [BADGE_ETAT.RECU]: 'badge-dark',
                [BADGE_ETAT.APPROUVE]: 'badge-success',
                [BADGE_ETAT.REJETE]: 'badge-danger',
            },
            [BADGE_ETAPE.CLOTURE]: {
                [BADGE_ETAT.ABANDONNE]: 'badge-warning'
            },
            };

            return stateMap[selected${subModuleName}.statut]?.[selected${subModuleName}.traitement] || 'badge-dark';
        }

        public handleAction(params: Action): void {
            this.onSelect$subModuleName(params.data);

            switch (params.view) {
            case 'modal':
                if (params.action === 'view-$subModuleName') { this.handle${subModuleName}Treatment(params.data) }
                if (params.action === 'journal-$subModuleName') { this.handleJournal(params.data) };
                break;

            case 'page':
                if (params.action === 'invoice-$subModuleName') { this.interfaceUser.emit(params) };
                if (params.action === 'open-folder-$subModuleName') { this.interfaceUser.emit(params) };
                if (params.action === 'mass-edit-$subModuleName') { this.interfaceUser.emit(params) };
                if (params.action === 'mass-add-$subModuleName') { this.interfaceUser.emit(params) };
                if (params.action === 'simple-add-$subModuleName') { this.interfaceUser.emit(params) };
                break;
            }
        }

        handle${subModuleName}Treatment(selected${subModuleName}: { statut: string, traitement: string }): void {
            this.visibleForm${subModuleName} = true;
            this.typeTreatment = this.getTreatmentButtonViewStyle(selected${subModuleName})?.typeTreatment;
        }
        handleJournal(data: { numero_demande: string }): void {
            const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
            modalRef.componentInstance.numero_demande = selected${subModuleName}?.numero_demande;
            modalRef.componentInstance.typeJournal = "demandes-services";
        }

        private onSelect${subModuleName}(selected${subModuleName}: ${subModuleName}Interface): void {
            this.demandSelected = selected${subModuleName};
            this.sharedService.set${subModuleName}Selected(selected${subModuleName});
        }

        hideDialog(): void {
            this.visibleForm${subModuleName} = false;
        }

        getTreatmentButtonView${subModuleName}Style(selected${subModuleName}: { statut: string, traitement: string }): { class: string, icon: string, tooltip: string, typeTreatment: TreatmentDemands } {
            const STOP_OR_CHANGE = this.translate.instant('STOP_OR_CHANGE');
            const DETAILS_OF_THE_REQUEST = this.translate.instant('DETAILS_OF_THE_REQUEST');
            switch (selected${subModuleName}?.statut) {
            case BADGE_ETAPE.SOUMISSION: {
                if (selected${subModuleName}?.traitement === BADGE_ETAT.EN_ATTENTE) {
                return createButtonStyle('p-button-warning', 'pi pi-times', STOP_OR_CHANGE, this.typeTreatment, { abandonner: true, modifier: true, visualiser: false });
                }
                if (selected${subModuleName}?.traitement === BADGE_ETAT.REJETE) {
                return createButtonStyle('p-button-warning', 'pi pi-times', STOP_OR_CHANGE, this.typeTreatment, { abandonner: true, modifier: true, visualiser: false });
                }
            }
            }
            return createButtonStyle('p-button-secondary', 'pi pi-eye', DETAILS_OF_THE_REQUEST, this.typeTreatment, { abandonner: false, modifier: false, visualiser: true });
        }

        getTreatmentButtonOpen${subModuleName}Style(selected${subModuleName}: { statut: string, traitement: string }): { class: string, icon: string, tooltip: string } {
            const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
            const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');
            switch (selected${subModuleName}?.statut) {
            case BADGE_ETAPE.TRAITEMENT: {
                if (selected${subModuleName}?.traitement === BADGE_ETAT.EN_COURS) {
                return createButtonStyle('p-button-success', 'pi pi-folder-open', SIM_OF_THE_REQUEST, this.typeTreatment);
                }
            }
            }
            return createButtonStyle('p-button-secondary', 'pi pi-folder-open', CANNOT_SEE_THE_SIM, this.typeTreatment);
        }


        getTreatmentButtonPaiement${subModuleName}Style(selected${subModuleName}: { type_paiement: string }): { class: string, icon: string, tooltip: string } {
            const SOLVE = this.translate.instant('SOLVE');
            const MAKE_A_PAYMENT = this.translate.instant('MAKE_A_PAYMENT');
            if(!!selected${subModuleName}?.type_paiement) {
            return createButtonStyle('p-button-success', 'pi pi-print', SOLVE, this.typeTreatment);
            } else {
            return createButtonStyle('p-button-danger', 'pi pi-print', MAKE_A_PAYMENT, this.typeTreatment);
            }
        }
    }
"@
        Clear-Content "$featurePath/table-$subModuleName/table-$subModuleName.component.ts"
        Add-Content "$featurePath/table-$subModuleName/table-$subModuleName.component.ts" -Value $tableTsContent



    }
    else {
        Write-Host "⚠️ Le dossier '$featurePath' existe déjà."
    }



    # Créer le module ui
    if (-not (Test-Path $uiPath)) {
        New-Item -ItemType Directory -Path $uiPath -Force | Out-Null
        # Se déplacer dans le dossier du module principal avant de générer le composant
        Set-Location $fullModulePath
        ng g component "ui/$subModuleName"


        # Ajouter le code HTML au fichier .component.html
        $htmlContent = @"
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <app-breadcrumb [title]="module | translate" [active_item]="subModule | translate"></app-breadcrumb>
                <div class="card">
                    <div class="card-body">
                        <div style="margin-top: -2rem !important">


                            <app-page-title 
                                [title]="'MOBILE_SUBSCRIPTIONS' | translate" 
                            </app-page-title>
                                

                        </div>

                        <div>

                            <app-filter-$subModuleName 
                                (filter)="filter($event)"
                                [filterData]="filterData"
                                [listUsages$]="listUsages$"
                                [listApn$]="listApn$"
                                [listFormulas$]="listFormulas$"
                                [listFirstLevel$]="listFirstLevel$"
                                [listThirdLevel$]="listThirdLevel$"
                                [listAlarms]="listAlarms"
                                [listApplicants$]="listApplicants$" 
                                [listStep$subModuleName ]="listStep$subModuleName " 
                                [listState$subModuleName ]="listState$subModuleName ">
                            </app-filter-$subModuleName>

                            <hr />

                            <app-table-$subModuleName 
                                [pagination]="pagination"
                                [list${subModuleName}$]="list${subModuleName}$"
                                [${subModuleName}Selected]="${subModuleName}Selected"
                                (interfaceUser)="navigateByUrl($event)">
                            </app-table-$subModuleName>

                            <app-pagination [pagination]="pagination" (pageChange)="onPageChange($event)"></app-pagination>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
"@
        Clear-Content "$uiPath/$subModuleName.component.html"
        Add-Content "$uiPath/$subModuleName.component.html" -Value $htmlContent

        # Ajouter le code TypeScript au fichier .component.ts
        $tsContent = @"
import { UsageInterface } from './../../../../../shared/interfaces/usage.interface';
import { SharedService } from './../../../../../shared/services/shared.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { OperationTransaction } from './../../../../../shared/enum/OperationTransaction.enum';
import { BADGE_ETAPE, T_BADGE_ETAPE } from './../../../../../shared/constants/badge-etape.constant';
import { BADGE_ETAT, T_BADGE_ETAT } from './../../../../../shared/constants/badge-etat.contant';
import { $subModuleName  } from '../../data-access/$subModuleName/interfaces/$subModuleName .interface';
import { combineLatest, Observable } from 'rxjs';
import { TypeAlarme } from '../../../../../shared/enum/TypeAlarme.enum';
import { FormulasInterface } from '../../../../../shared/interfaces/formulas.interface';
import { INVOICE } from '../../../$moduleName/$moduleName-routing.module';
import { FORM } from '../../../$moduleName/$moduleName-routing.module';
import { ${subModuleName}ApiService } from '../../data-access/$subModuleName/services/$subModuleName-api.service';
import { ${subModuleName}Interface } from '../../data-access/${subModuleName}/interfaces/${subModuleName}.interface';
import { ${subModuleName}FilterInterface } from '../../data-access/$subModuleName/interfaces/$subModuleName-filter.interface';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { ApnInterface } from '../../../../../shared/interfaces/apn.interface';
import { FirstLevelInterface } from '../../../../../shared/interfaces/first-level.interface';
import { ThirdLevelInterface } from '../../../../../shared/interfaces/third-level.interface';

const etape_values = [BADGE_ETAPE.SOUMISSION, BADGE_ETAPE.TRAITEMENT];
const etat_values = [BADGE_ETAT.RECU, BADGE_ETAT.EN_COURS, BADGE_ETAT.TERMINE];
type PageAction = { data: Folder, action: 'open-folder-$moduleName' | 'invoice-$moduleName' | 'mass-edit-$moduleName' | 'simple-add-$moduleName' | 'mass-add-$moduleName', view: 'page' };

    @Component({
        selector: 'app-$subModuleName',
        templateUrl: `./$subModuleName.component.html`
    })

    export class ${subModuleName}Component implements OnInit {
        public module: string;
        public subModule: string;
        public pagination$': Observable<Paginate<${subModuleName}Interface>>;
        public filterData: ${subModuleName}FilterInterface;
        public list${subModuleName}: Array<$subModuleName > = [];
        public list${subModuleName}$': Observable<Array<${subModuleName}Interface>>;
        public listUsages$': Observable<Array<UsageInterface>>;
        public listApn$': Observable<Array<ApnInterface>>;
        public listFormulas$': Observable<Array<FormulasInterface>>;
        public listFirstLevel$': Observable<Array<FirstLevelInterface>>;
        public listThirdLevel$': Observable<Array<ThirdLevelInterface>>;
        public listAlarms: Array<TypeAlarme> = [];
        public listStep$subModuleName : Array<T_BADGE_ETAPE> = step_values;
        public listState$subModuleName : Array<T_BADGE_ETAT> = state_values;
        public listApplicants$': Observable<any[]>;

        constructor(private router: Router, private sharedService: SharedService,
            private activatedRoute: ActivatedRoute,
            private ${subModuleName}ApiService: ${subModuleName}ApiService) {
        }

        ngOnInit(): void {
            this.activatedRoute.data.subscribe((data) => {
                this.module = data['module'];
                this.subModule = data['subModule'][1];
            });
            this.sharedService.fetchUsages();
            this.listUsages$ = this.sharedService.getUsages();
            this.sharedService.fetchFormulas();
            this.listFormulas$ = this.sharedService.getFormulas();
            this.sharedService.fetchApn();
            this.listApn$ = this.sharedService.getApn();
            this.sharedService.fetchFirstLevel();
            this.listFirstLevel$ = this.sharedService.getFirstLevel();;
            this.sharedService.fetchThirdLevel();
            this.listThirdLevel$ = this.sharedService.getThirdLevel();
            this.sharedService.fetchApplicants({});
            this.listApplicants$ = this.sharedService.getApplicants();
            this.list${subModuleName}$ = this.${subModuleName}ApiService.get${subModuleName}();
            this.pagination$ = this.${subModuleName}ApiService.get${subModuleName}Pagination();

            combineLatest([
                this.${subModuleName}ApiService.getDataFilter${subModuleName}(),
                this.${subModuleName}ApiService.getDataNbrPage${subModuleName}()
            ]).subscribe(([filterData, nbrPageData]) => {
                this.${subModuleName}ApiService.fetch${subModuleName}(filterData, nbrPageData);
            });
        }

        public filter(filterData: ${subModuleName}FilterInterface): void {
            this.filterData = filterData;
            this.sharedService.fetch${subModuleName}(filterData)
        }

        public onPageChange(event: number): void {
            this.${subModuleName}ApiService.fetch${subModuleName}(this.filterData, JSON.stringify(event + 1))
        }

        public navigateByUrl(params: PageAction): void {
            const number_demand = params.data ? params.data["numero_demande"] : null;
            const ref = params.action;
            const operation = OperationTransaction.ACTIVATION;
            const current_page = this.pagination?.['current_page'] || 1;
            const queryParams = { ref, operation, current_page };
            let routePath: string = '';

            switch (params.action) {
            case "invoice-${subModuleName}": routePath = '${INVOICE}/${number_demand}'; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
            case "open-folder-${subModuleName}": routePath = '${number_demand}'; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
            case "mass-edit-${subModuleName}":
            case "simple-add-${subModuleName}": routePath = FORM; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams: { ...queryParams, operation: OperationTransaction.ACTIVATION } }); break;
            case "mass-add-${subModuleName}": routePath = FORM; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams: { ...queryParams, operation: OperationTransaction.ACTIVATION_EN_MASSE } }); break;
            }
        }
    }
"@
        Clear-Content "$uiPath/$subModuleName.component.ts"
        Add-Content "$uiPath/$subModuleName.component.ts" -Value $tsContent


    }
    else {
        Write-Host "⚠️ Le dossier '$uiPath' existe déjà."
    }
}


# Demander si un sous-module doit être créé
$includeSubModule = Read-Host "Voulez-vous inclure un sous-module ? (y/n)"

if ($includeSubModule -eq "y") {
    do {
        $subModuleName = (Read-Host "Entrez le nom du sous-module (ex: invoice1)").Trim()
        if (-not [string]::IsNullOrEmpty($subModuleName)) {
            Create-SubModule -subModuleName $subModuleName
        }
        else {
            Write-Host "❌ Le nom du sous-module ne peut pas être vide."
        }

        # Demander si l'utilisateur souhaite ajouter un autre sous-module
        $addAnother = Read-Host "Voulez-vous ajouter un autre sous-module ? (y/n)"
    } while ($addAnother -eq "y")
}
else {
    Write-Host "❌ Aucun sous-module généré."
    exit
}

if (-not (Test-Path $featurePath)) {

    New-Item -ItemType Directory -Path "$featurePath/filter-$subModuleName" -Force
    New-Item -ItemType Directory -Path "$featurePath/table-$subModuleName" -Force

    ng g component "feature/$subModuleName/filter-$subModuleName"
    ng g component "feature/$subModuleName/table-$subModuleName"

    # Ajouter le code HTML au fichier table.component.html
    $tableHtmlContent = @"
        <p-table #dt [value]="list${subModuleName}$ | async" [rowHover]="true" dataKey="id" selectionMode="single" 
        [(selection)]="${subModuleName}Selected" [rows]="(pagination$ | async)?.per_page"
        [globalFilterFields]="table.globalFilterFields">
        <ng-template pTemplate="caption">
            <div class="d-flex justify-content-between">
                <app-table-title [count]="(pagination$ | async)?.total" [perPage]="(pagination$ | async)?.per_page"
                    [page]="(pagination$ | async)?.currentPage" [totalPage]="(pagination$ | async)?.last_page">
                </app-table-title>
                <div class="d-flex gap-2 align-items-center">
                    <div class="d-flex gap-2">
                        <button pButton pRipple [label]="'SIMPLE_DEMAND' | translate"
                            icon="pi pi-plus" class="p-button-success margin-right-5"
                            (click)="handleAction({'data': null, 'action': 'simple-add-$subModuleName', 'view': 'page'})">
                        </button>
                        <app-table-button-header (refresh)="pageCallback()" (export)="onExportExcel()"
                            [disabledButtonExport]="(list${subModuleName}$ | async)?.length === 0" [labelOther]="'MASS_DEMAND' | translate"
                            [colorOther]="'dark'" [hiddenButtonOther]="false" [iconOther]="'pi pi-plus'"
                            (other)="handleAction({'data': null, 'action': 'mass-add-$subModuleName', 'view': 'page'})">
                        </app-table-button-header>
                    </div>
                    <div>
                        <app-search-table [dt]="dt"></app-search-table>
                    </div>
                </div>
            </div>
        </ng-template>
        <ng-template pTemplate="header">
            <tr>
                <th *ngFor="let col of table.cols" [class]="col.class" [ngStyle]="{'width': col.width}">
                    <ng-container [ngSwitch]="col.header">
                        <ng-container *ngSwitchCase="'Date / Heure'">
                            {{ 'DATE_TIME' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'N° Dossier'">
                            {{ 'NUMBER_FOLDER' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'# Lignes'">
                            {{ 'NUMBER_LINES' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'# Traitées'">
                            {{ 'NUMBER_TREATED' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'# Identifiées'">
                            {{ 'NUMBER_IDENTIFIED' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'Etape'">
                            {{ 'STEP' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'Etat'">
                            {{ 'STATE' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'Date Etat'">
                            {{ 'UPDATED_DATE' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'Demandeur'">
                            {{ 'APPLICANT' | translate }}
                        </ng-container>
                        <ng-container *ngSwitchDefault>
                            {{col.header}}
                        </ng-container>
                    </ng-container>
                </th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowIndex="rowIndex" let-item>
            <tr [pSelectableRow]="item">
                <td *ngFor="let col of table.cols" [class]="col.class" [ngStyle]="{'width': col.width}">
                    <ng-container [ngSwitch]="col.header">
                        <ng-container *ngSwitchCase="'#'">
                            {{ rowIndex + pagination?.current_page }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'N° Commande'">
                            <span (click)="copyToClipboard(item?.[col.field])">
                                {{ item?.[col.field] }}
                            </span>
                        </ng-container>
                        <ng-container *ngSwitchCase="'Etape'">
                            <span [ngStyle]="{ 'font-size': '16px' }" [class]="'badge '+getStep${subModuleName}Badge(item)">
                                {{ item?.[col.field] }}
                            </span>
                        </ng-container>
                        <ng-container *ngSwitchCase="'Etat'">
                            <span [ngStyle]="{ 'font-size': '16px' }" [class]="'badge '+getState${subModuleName}Badge(item)">
                                {{ item?.[col.field] }}
                            </span>
                        </ng-container>
                        <ng-container *ngSwitchCase="'Date Etat'">
                            {{ item?.[col.field] }}
                        </ng-container>
                        <ng-container *ngSwitchCase="'Actions'">
                            <button pButton [ngClass]="getTreatmentButtonOpen${subModuleName}Style(item)?.class"
                                [icon]="getTreatmentButtonOpen${subModuleName}Style(item)?.icon" tooltipPosition="top"
                                [pTooltip]="getTreatmentButtonOpen${subModuleName}Style(item)?.['tooltip']"
                                (click)="handleAction({'data': item, 'action': 'open-folder-${subModuleName}', 'view': 'page'})">
                            </button>&nbsp;
                            <button pButton [ngClass]="getTreatmentButtonView${subModuleName}Style(item)?.class"
                                [icon]="getTreatmentButtonView${subModuleName}Style(item)?.icon" tooltipPosition="top"
                                [pTooltip]="getTreatmentButtonView${subModuleName}Style(item)?.['tooltip']"
                                (click)="handleAction({'data': item, 'action': 'view-${subModuleName}', 'view': 'modal'})">
                            </button>&nbsp;
                            <button pButton [ngClass]="getTreatmentButtonPaiement${subModuleName}Style(item)?.class"
                                [icon]="getTreatmentButtonPaiement${subModuleName}Style(item)?.icon" tooltipPosition="top"
                                [pTooltip]="getTreatmentButtonPaiement${subModuleName}Style(item)?.['tooltip']"
                                (click)="handleAction({'data': item, 'action': 'invoice-${subModuleName}', 'view': 'page'})">
                            </button>&nbsp;
                            <button pButton icon="pi pi-book" class="p-button-primary" tooltip="Journal du ${subModuleName}"
                                (click)="handleAction({'data': item, 'action': 'journal-${subModuleName}', 'view': 'modal'})">
                            </button>
                        </ng-container>
                        <ng-container *ngSwitchDefault>
                            {{item?.[col.field]}}
                        </ng-container>
                    </ng-container>
                </td>
            </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
            <tr *ngIf="(list${subModuleName}$ | async)?.length <= 0 && !spinner">
                <td class="posRelative" colspan="15">
                    <span class="posCenter"> {{ 'NO_DATA_FOUND' | translate }} </span>
                </td>
            </tr>
            <tr *ngIf="spinner">
                <td class="posRelative" colspan="15">
                    <p-progressSpinner class="posCenter" [style]="{ width: '40px', height: '50px' }"
                        styleClass="custom-spinner" strokeWidth="8" fill="#EEEEEE" animationDuration=".5s">
                    </p-progressSpinner>
                </td>
            </tr>
        </ng-template>

    </p-table>

    <p-dialog header="[{{ 'TRACKING_PROCESSING' | translate }}] {{ 'DEMAND' | translate }} [{{${subModuleName}Selected?.numero_demande}}]"
        [(visible)]="visibleForm$subModuleName" (onHide)="hideDialog()" [modal]="true" [closable]="true"
        [style]="{'width': '100%', 'min-height': '100%'}" [responsive]="true" [maximizable]="true" 
        [draggable]="false"
        [resizable]="true">

        <ng-template pTemplate="content">
            <app-form-folder 
                [${subModuleName}Selected]="${subModuleName}Selected" 
                [typeTreatment]="typeTreatment"
                (visibleForm$subModuleName)="hideDialog()">
            </app-form-folder>
        </ng-template>

    </p-dialog>
"@
    Clear-Content "$featurePath/table-$subModuleName/table-$subModuleName.component.html"
    Add-Content "$featurePath/table-$subModuleName/table-$subModuleName.component.html" -Value $tableHtmlContent
        

    # Ajouter le code TypeScript au fichier table.component.ts
    $tableTsContent = @"
    import { ModalParams } from './../../../../../../shared/constants/modalParams.contant';
    import { JournalComponent } from './../../../../../../shared/components/journal/journal.component';
    import { Component, Input, Output, EventEmitter } from '@angular/core';
    import { ToastrService } from 'ngx-toastr';
    import { ClipboardService } from 'ngx-clipboard';
    import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
    import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
    import { SharedDataService } from '../../../../../../shared/services/shared-data.service';
    import { SupervisionOperationService } from '../../../data-access/supervision-operation.service';
    import { BADGE_ETAT } from '../../../../../../shared/constants/badge-etat.contant';
    import { BADGE_ETAPE } from '../../../../../../shared/constants/badge-etape.constant';
    import { TypeTraitement } from '../../../data-access/traitement';

    type Action = PageAction | ModalAction;
    type PageAction = { data: ${subModuleName}Interface, action: 'open-folder-$subModuleName' | 'invoice-$subModuleName' | 'mass-edit-$subModuleName' | 'mass-add-$subModuleName' | 'simple-add-$subModuleName', view: 'page' };
    type ModalAction = { data: ${subModuleName}Interface, action: 'view-$subModuleName' | 'journal-$subModuleName', view: 'modal' };
    const INIT_TYPE_TRAITEMENT: Treatment$subModuleName = { module: "$moduleName", abandonner: false, modifier: false, visualiser: false, cloturer: false}
    type TYPE_COLOR_ETAPE_BADGE = 'badge-dark' | 'badge-warning' | 'badge-info' | 'badge-success';
    type TYPE_COLOR_ETAT_BADGE = 'badge-warning' | 'badge-dark' | 'badge-success' | 'badge-danger';

    @Component({
        selector: 'app-table-$subModuleName',
        templateUrl: './table-$subModuleName.component.html'
    })

    export class Table${subModuleName}Component {

        @Input() (list${subModuleName}$): Array<${subModuleName}Interface>;
        @Input() ${subModuleName}Selected: ${subModuleName}Interface;
        @Input() 'pagination$': Observable<Paginate<${subModuleName}Interface>>;
        @Output() interfaceUser = new EventEmitter<any>();
        public typeTreatment: Treatment$subModuleName = INIT_TYPE_TRAITEMENT;
        public visibleFormDossier = false;

        public readonly table: TableConfig = ${subModuleName}TableConstant;
        public readonly BADGE_STEP = BADGE_ETAPE;
        public readonly BADGE_STATE = BADGE_ETAT;

        constructor(private toastService: ToastrService, private clipboardService: ClipboardService, private ngbModal: NgbModal,
            private sharedService: SharedService, private tableExportExcelFileService: TableExportExcelFileService,
            private translate: TranslateService) { }

        public onExportExcel(): void {
            this.tableExportExcelFileService.exportAsExcelFile(this.list${subModuleName}, this.table, "List_$subModuleName");
        }

        public pageCallback() {
            this.${subModuleName}ApiService.fetch${subModuleName}({} as ${subModuleName}FilterInterface);
        }

        public copyToClipboard(data: string): void {
            const translatedMessage = this.translate.instant('COPIED_TO_THE_CLIPBOARD');
            this.toastService.success(translatedMessage);
            this.clipboardService.copyFromContent(data);
        }

        getStep${subModuleName}Badge(selected${subModuleName}?: { statut: T_BADGE_ETAPE; }): TYPE_COLOR_ETAPE_BADGE {
            if (!selected${subModuleName} || !selected${subModuleName}.statut) {
            return 'badge-dark';
            }

            const etapeMap: Record<T_BADGE_ETAPE, TYPE_COLOR_ETAPE_BADGE> = {
            [BADGE_ETAPE.SOUMISSION]: 'badge-dark',
            [BADGE_ETAPE.TRAITEMENT]: 'badge-warning',
            [BADGE_ETAPE.FINALISATEUR]: 'badge-info',
            [BADGE_ETAPE.CLOTURE]: 'badge-success',
            };
            return etapeMap[selected${subModuleName}.statut] || 'badge-dark';
        }


        getState${subModuleName}Badge(selected${subModuleName}?: { statut?: T_BADGE_ETAPE; traitement?: T_BADGE_ETAT }): TYPE_COLOR_ETAT_BADGE {
            if (!selected${subModuleName} || !selected${subModuleName}.statut || !selected${subModuleName}.traitement) {
            return 'badge-dark';
            }

            const stateMap: Partial<Record<T_BADGE_ETAPE, Partial<Record<T_BADGE_ETAT, TYPE_COLOR_ETAT_BADGE>>>> = {
            [BADGE_ETAPE.SOUMISSION]: {
                [BADGE_ETAT.EN_ATTENTE]: 'badge-dark',
                [BADGE_ETAT.PARTIEL]: 'badge-warning',
                [BADGE_ETAT.RECU]: 'badge-dark',
                [BADGE_ETAT.APPROUVE]: 'badge-success',
                [BADGE_ETAT.REJETE]: 'badge-danger',
            },
            [BADGE_ETAPE.CLOTURE]: {
                [BADGE_ETAT.ABANDONNE]: 'badge-warning'
            },
            };

            return stateMap[selected${subModuleName}.statut]?.[selected${subModuleName}.traitement] || 'badge-dark';
        }

        public handleAction(params: Action): void {
            this.onSelect$subModuleName(params.data);

            switch (params.view) {
            case 'modal':
                if (params.action === 'view-$subModuleName') { this.handle${subModuleName}Treatment(params.data) }
                if (params.action === 'journal-$subModuleName') { this.handleJournal(params.data) };
                break;

            case 'page':
                if (params.action === 'invoice-$subModuleName') { this.interfaceUser.emit(params) };
                if (params.action === 'open-folder-$subModuleName') { this.interfaceUser.emit(params) };
                if (params.action === 'mass-edit-$subModuleName') { this.interfaceUser.emit(params) };
                if (params.action === 'mass-add-$subModuleName') { this.interfaceUser.emit(params) };
                if (params.action === 'simple-add-$subModuleName') { this.interfaceUser.emit(params) };
                break;
            }
        }

        handle${subModuleName}Treatment(selected${subModuleName}: { statut: string, traitement: string }): void {
            this.visibleForm${subModuleName} = true;
            this.typeTreatment = this.getTreatmentButtonViewStyle(selected${subModuleName})?.typeTreatment;
        }
        handleJournal(data: { numero_demande: string }): void {
            const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
            modalRef.componentInstance.numero_demande = selected${subModuleName}?.numero_demande;
            modalRef.componentInstance.typeJournal = "demandes-services";
        }

        private onSelect${subModuleName}(selected${subModuleName}: ${subModuleName}Interface): void {
            this.demandSelected = selected${subModuleName};
            this.sharedService.set${subModuleName}Selected(selected${subModuleName});
        }

        hideDialog(): void {
            this.visibleForm${subModuleName} = false;
        }

        getTreatmentButtonView${subModuleName}Style(selected${subModuleName}: { statut: string, traitement: string }): { class: string, icon: string, tooltip: string, typeTreatment: TreatmentDemands } {
            const STOP_OR_CHANGE = this.translate.instant('STOP_OR_CHANGE');
            const DETAILS_OF_THE_REQUEST = this.translate.instant('DETAILS_OF_THE_REQUEST');
            switch (selected${subModuleName}?.statut) {
            case BADGE_ETAPE.SOUMISSION: {
                if (selected${subModuleName}?.traitement === BADGE_ETAT.EN_ATTENTE) {
                return createButtonStyle('p-button-warning', 'pi pi-times', STOP_OR_CHANGE, this.typeTreatment, { abandonner: true, modifier: true, visualiser: false });
                }
                if (selected${subModuleName}?.traitement === BADGE_ETAT.REJETE) {
                return createButtonStyle('p-button-warning', 'pi pi-times', STOP_OR_CHANGE, this.typeTreatment, { abandonner: true, modifier: true, visualiser: false });
                }
            }
            }
            return createButtonStyle('p-button-secondary', 'pi pi-eye', DETAILS_OF_THE_REQUEST, this.typeTreatment, { abandonner: false, modifier: false, visualiser: true });
        }

        getTreatmentButtonOpen${subModuleName}Style(selected${subModuleName}: { statut: string, traitement: string }): { class: string, icon: string, tooltip: string } {
            const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
            const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');
            switch (selected${subModuleName}?.statut) {
            case BADGE_ETAPE.TRAITEMENT: {
                if (selected${subModuleName}?.traitement === BADGE_ETAT.EN_COURS) {
                return createButtonStyle('p-button-success', 'pi pi-folder-open', SIM_OF_THE_REQUEST, this.typeTreatment);
                }
            }
            }
            return createButtonStyle('p-button-secondary', 'pi pi-folder-open', CANNOT_SEE_THE_SIM, this.typeTreatment);
        }


        getTreatmentButtonPaiement${subModuleName}Style(selected${subModuleName}: { type_paiement: string }): { class: string, icon: string, tooltip: string } {
            const SOLVE = this.translate.instant('SOLVE');
            const MAKE_A_PAYMENT = this.translate.instant('MAKE_A_PAYMENT');
            if(!!selected${subModuleName}?.type_paiement) {
            return createButtonStyle('p-button-success', 'pi pi-print', SOLVE, this.typeTreatment);
            } else {
            return createButtonStyle('p-button-danger', 'pi pi-print', MAKE_A_PAYMENT, this.typeTreatment);
            }
        }
    }
"@
    Clear-Content "$featurePath/table-$subModuleName/table-$subModuleName.component.ts"
    Add-Content "$featurePath/table-$subModuleName/table-$subModuleName.component.ts" -Value $tableTsContent



    # Ajouter le code TypeScript au fichier filter.component.html
    $filterHtmlContent = @"
<form [formGroup]="formFilter" (ngSubmit)="onSubmitFilterForm()">
    <div class="d-flex gap-1">
        <div class="width-100">
            <label><b>{{'STATUS' | translate}}&nbsp;{{'ALARM' | translate}}</b></label>
            <p-select formControlName="alarme" [options]="listAlarms" [showClear]="true" [filter]="true"
                placeholder="{{ 'SELECT' | translate }} {{ 'ALARM' | translate }}"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>

        <div class="width-100">
            <label><b>{{ firstLevelLibel }}</b></label>
            <p-select formControlName="niveau_un_uuid" [options]="listFirstLevel$ | async" optionValue="uuid"
                optionLabel="nom" filterBy="nom" [showClear]="true" [filter]="true"
                placeholder="{{ 'SELECT' | translate }} {{firstLevelLibel}}"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>

        <div class="width-100">
            <label><b>{{ secondLevelLibel }}</b></label>
            <p-select formControlName="niveau_deux_uuid" [options]="listSecondLevel" optionValue="uuid"
                optionLabel="nom" filterBy="nom" [showClear]="true" [filter]="true"
                placeholder="{{ 'SELECT' | translate }} {{secondLevelLibel}}"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>

        <div class="width-80">
            <label><b>{{'MSISDN' | translate}}</b></label>
            <input formControlName="msisdn" type="text" pInputText placeholder="{{'MSISDN' | translate}}"
                [style]="{ minWidth: '100%' }" />
        </div>

        <div class="width-80">
            <label><b>{{'IMSI' | translate}}</b></label>
            <input formControlName="imsi" type="text" pInputText placeholder="{{'IMSI' | translate}}"
                [style]="{ minWidth: '100%' }" />
        </div>

        <div class="width-80">
            <label><b>{{'APN' | translate}}</b></label>
            <p-select formControlName="apn" [options]="listApn$ | async" optionValue="apn" optionLabel="apn"
                filterBy="apn" [showClear]="true" [filter]="true"
                placeholder="{{ 'SELECT' | translate }} {{ 'APN' | translate }}"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>

        <div class="width-80">
            <label><b>{{'IP_ADDRESS' | translate}}</b></label>
            <input formControlName="adresse_ip" type="text" pInputText placeholder="{{'IP_ADDRESS' | translate}}"
                [style]="{ minWidth: '100%' }" />
        </div>

        <div class="filter-button" *ngIf="!secondFilter">
            <button pButton pRipple type="submit" class="p-button-success" icon="pi pi-filter"></button>
        </div>

        <div class="filter-button">
            <button *ngIf="!secondFilter" (click)="showSecondFilter()" pButton pRipple class="p-button-dark"
                icon="pi pi-plus">
            </button>
            <button *ngIf="secondFilter" (click)="showSecondFilter()" pButton pRipple class="p-button-dark"
                icon="pi pi-minus">
            </button>
        </div>

    </div>

    <br *ngIf="secondFilter">


    <div class="d-flex gap-1" *ngIf="secondFilter" style="padding-top: 0.7rem">

        <div class="width-100">
            <label><b>{{'USAGE' | translate}}</b></label>
            <p-select formControlName="usage_id" [options]="listUsages$ | async" optionLabel="nom_usage"
                [showClear]="true" placeholder="{{ 'SELECT' | translate }} {{ 'USAGE' | translate }}" optionValue="uuid"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>
        <div class="width-100">
            <label><b>{{'DESTINATION_FORMULA' | translate}}</b></label>
            <p-select formControlName="formule_uuid" [options]="listFormulas$ | async" optionLabel="nom"
                [showClear]="true" placeholder="{{ 'SELECT' | translate }} {{ 'ALARM' | translate }}" optionValue="uuid"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>
        <div class="width-100">
            <label><b>{{ thirdLevelLibel }}</b></label>
            <p-select formControlName="niveau_trois_uuid" [options]="listThirdLevel$ | async" optionValue="uuid"
                optionLabel="nom" filterBy="nom" [showClear]="true" [filter]="true"
                placeholder="{{ 'SELECT' | translate }} {{ thirdLevelLibel }}"
                emptyFilterMessage="{{'NO_MATCH' | translate}}" emptyMessage="{{'NO_DATA_FOUND' | translate}}">
            </p-select>
        </div>
        <div class="width-100">
            <label><b>{{ 'NAME_LOCATION' | translate }}</b></label>
            <input formControlName="point_emplacement" type="text" pInputText
                placeholder="{{'NAME_LOCATION' | translate}}" [style]="{ minWidth: '100%' }" />
        </div>
        <div class="width-100">
            <label><b>{{ 'TRAFFIC_ZONE' | translate }}</b></label>
            <input formControlName="zone_trafic" type="text" pInputText
                placeholder="{{'TRAFFIC_ZONE' | translate}}" [style]="{ minWidth: '100%' }" />
        </div>
        <div class="col-md-2">
            <label><b>{{'START_DATE' | translate}}</b></label>
            <p-datepicker formControlName="date_debut" [showIcon]="true" [placeholder]="'JJ-MM-AAAA'"
                dateFormat="dd-mm-yy">
            </p-datepicker>
        </div>
        <div class="col-md-2">
            <label><b>{{'END_DATE' | translate}}</b></label>
            <p-datepicker formControlName="date_fin" [showIcon]="true" placeholder="JJ-MM-AAAA" dateFormat="dd-mm-yy">
            </p-datepicker>
        </div>
        <div class="filter-button">
            <button pButton pRipple type="submit" class="p-button-success" icon="pi pi-filter"></button>
        </div>

    </div>
</form>
"@
    Clear-Content "$featurePath/filter-$subModuleName/filter-$subModuleName.component.html"
    Add-Content "$featurePath/filter-$subModuleName/filter-$subModuleName.component.html" -Value $filterHtmlContent



    # Ajouter le code TypeScript au fichier filter.component.ts
    $filterTsContent = @"
    import { SecondLevelService } from '../../../../../../shared/services/second-level.service';
import { Component, Input, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { MappingService } from '../../../../../../shared/services/mapping.service';
import { Observable } from 'rxjs';
import { FormulasInterface } from '../../../../../../shared/interfaces/formulas.interface';
import { FirstLevelInterface, SecondLevelInterface } from '../../../../../../shared/interfaces/first-level.interface';
import { ThirdLevelInterface } from '../../../../../../shared/interfaces/third-level.interface';
import { UsageInterface } from '../../../../../../shared/interfaces/usage.interface';
import { ApnInterface } from '../../../../../../shared/interfaces/apn.interface';
import { TypeAlarme } from '../../../../../../shared/enum/TypeAlarme.enum';
import { ${subModuleName}FilterInterface } from '../../../data-access/${subModuleName}/interfaces/${subModuleName}-filter.interface';
import { TranslateService } from '@ngx-translate/core';

    @Component({
        selector: 'app-filter-$subModuleName',
        templateUrl: `./filter-$subModuleName.component.html`,
        styles: [`:host ::ng-deep { .p-datepicker { position: relative; display: inline-flex; max-width: 100%; width: 21rem !important; } }`]
    })

    export class Filter${subModuleName}Component {

    @Input() 'listFormulas$': Observable<Array<FormulasInterface>>;
    @Input() 'listFirstLevel$': Observable<Array<FirstLevelInterface>>;
    @Input() 'listThirdLevel$': Observable<Array<ThirdLevelInterface>>;
    @Input() 'listUsages$': Observable<Array<UsageInterface>>;
    @Input() 'listApn$': Observable<Array<ApnInterface>>;
    @Input() listStep$subModuleName : Array<T_BADGE_ETAPE>;
    @Input() listState$subModuleName : Array<T_BADGE_ETAT>;
    @Input() listAlarms: Array<TypeAlarme> = [];
    @Input() filterData: ${subModuleName}FilterInterface;
    
    @Output() filter = new EventEmitter<${subModuleName}FilterInterface>();

    public listSecondLevel: Array<SecondLevelInterface>|void;
    public formFilter: FormGroup;

    public firstLevelLibel: string;
    public secondLevelLibel: string;
    public thirdLevelLibel: string;

    public secondFilter: boolean = false;

    constructor(private toastService: ToastrService, private fb: FormBuilder,
        private mappingService: MappingService, private translate: TranslateService,
        private secondLevelService: SecondLevelService) {
        this.initFormFilter();
        this.firstLevelLibel = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibel = this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibel = this.mappingService.structureGlobale?.niveau_3;
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group<${subModuleName}FilterInterface>({
            imsi: new FormControl<string>(this.filterData?.["imsi"], { nonNullable: true,
                validators: [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)],
            }),
            iccid: new FormControl<string>(this.filterData?.["iccid"], { nonNullable: true }),
            statut: new FormControl<string>(this.filterData?.["statut"], { nonNullable: true }),
            date_debut: new FormControl<string>(this.filterData?.["date_debut"], { nonNullable: true }),
            date_fin: new FormControl<string>(this.filterData?.["date_fin"], { nonNullable: true }),
            alarme: new FormControl<string>(this.filterData?.["alarme"], { nonNullable: true }),
            niveau_un_uuid: new FormControl<string>(this.filterData?.["niveau_un_uuid"], { nonNullable: true }),
            niveau_deux_uuid: new FormControl<string>(this.filterData?.["niveau_deux_uuid"], { nonNullable: true }),
            msisdn: new FormControl<string>(this.filterData?.["msisdn"], { nonNullable: true }),
            apn: new FormControl<string>(this.filterData?.["apn"], { nonNullable: true }),
            adresse_ip: new FormControl<string>(this.filterData?.["adresse_ip"], { nonNullable: true }),
            usage_id: new FormControl<string>(this.filterData?.["usage_id"], { nonNullable: true }),
            formule_uuid: new FormControl<string>(this.filterData?.["formule_uuid"], { nonNullable: true }),
            niveau_trois_uuid: new FormControl<string>(this.filterData?.["niveau_trois_uuid"], { nonNullable: true }),
            point_emplacement: new FormControl<string>(this.filterData?.["point_emplacement"], { nonNullable: true }),
            zone_trafic: new FormControl<string>(this.filterData?.["zone_trafic"], { nonNullable: true }),
        });

        this.formFilter.get("imsi")?.valueChanges.subscribe((value) => {
            if (value && value.length > 15) {
                this.formFilter.get("imsi")?.setValue(value.slice(0, 15), { emitEvent: false });
            }
        });

        this.formFilter.get("msisdn")?.valueChanges.subscribe((value) => {
            if (value && value.length > 10) {
                this.formFilter.get("msisdn")?.setValue(value.slice(0, 10), { emitEvent: false });
            }
        });
        this.formFilter?.get('niveau_un_uuid')?.valueChanges.subscribe(
            this.fetchSecondLevel.bind(this)
        );
    }

    fetchSecondLevel(uuid: string) {
        this.listSecondLevel = this.secondLevelService.getSecondLevel(uuid);
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }

    public onSubmitFilterForm(): void {
        const date_debut = moment(this.formFilter.get("date_debut")?.value).isValid()
            ? this.formFilter.get("date_debut")?.value : null;
        const date_fin = moment(this.formFilter.get("date_fin")?.value).isValid()
            ? this.formFilter.get("date_fin")?.value : null;

        if (date_debut && date_fin && moment(date_debut).isAfter(moment(date_fin))) {
            const INVALID_DATE_RANGE = this.translate.instant('INVALID_DATE_RANGE');
            this.toastService.error(INVALID_DATE_RANGE);
            return;
        }

        const filterData = {
            ...this.formFilter.value,
            date_debut: date_debut ? moment(date_debut).format('YYYY-MM-DD') : '',
            date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : ''
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.success(translatedMessage);
        }
    }

}
"@ 
    Clear-Content "$featurePath/filter-$subModuleName/filter-$subModuleName.component.ts"
    Add-Content "$featurePath/filter-$subModuleName/filter-$subModuleName.component.ts" -Value $filterTsContent


    Write-Host "✅ Module feature pour '$subModuleName' généré avec succès."
}
else {
    Write-Host "⚠️ Le dossier '$featurePath' existe déjà."
}

# Créer le module ui
if (-not (Test-Path $uiPath)) {
    New-Item -ItemType Directory -Path $uiPath -Force | Out-Null
    # Se déplacer dans le dossier du module principal avant de générer le composant
    Set-Location $fullModulePath
    ng g component "ui/$subModuleName"

        
    # Ajouter le code HTML au fichier .component.html
    $htmlContent = @"
   <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <app-breadcrumb [title]="module | translate" [active_item]="subModule | translate"></app-breadcrumb>
                <div class="card">
                    <div class="card-body">
                        <div style="margin-top: -2rem !important">


                            <app-page-title 
                                [title]="'MOBILE_SUBSCRIPTIONS' | translate" 
                            </app-page-title>
                                

                        </div>

                        <div>

                            <app-filter-$subModuleName 
                                (filter)="filter($event)"
                                [filterData]="filterData"
                                [listUsages$]="listUsages$"
                                [listApn$]="listApn$"
                                [listFormulas$]="listFormulas$"
                                [listFirstLevel$]="listFirstLevel$"
                                [listThirdLevel$]="listThirdLevel$"
                                [listAlarms]="listAlarms"
                                [listApplicants$]="listApplicants$" 
                                [listStep$subModuleName ]="listStep$subModuleName " 
                                [listState$subModuleName ]="listState$subModuleName ">
                            </app-filter-$subModuleName>

                            <hr />

                            <app-table-$subModuleName 
                                [pagination]="pagination"
                                [list${subModuleName}$]="list${subModuleName}$"
                                [${subModuleName}Selected]="${subModuleName}Selected"
                                (interfaceUser)="navigateByUrl($event)">
                            </app-table-$subModuleName>

                            <app-pagination [pagination]="pagination" (pageChange)="onPageChange($event)"></app-pagination>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
"@
    Clear-Content "$uiPath/$subModuleName.component.html"
    Add-Content "$uiPath/$subModuleName.component.html" -Value $htmlContent
        

    # Ajouter le code TypeScript au fichier .component.ts
    $tsContent = @"
import { UsageInterface } from './../../../../../shared/interfaces/usage.interface';
import { SharedService } from './../../../../../shared/services/shared.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { OperationTransaction } from './../../../../../shared/enum/OperationTransaction.enum';
import { BADGE_ETAPE, T_BADGE_ETAPE } from './../../../../../shared/constants/badge-etape.constant';
import { BADGE_ETAT, T_BADGE_ETAT } from './../../../../../shared/constants/badge-etat.contant';
import { $subModuleName  } from '../../data-access/$subModuleName/interfaces/$subModuleName .interface';
import { combineLatest, Observable } from 'rxjs';
import { TypeAlarme } from '../../../../../shared/enum/TypeAlarme.enum';
import { FormulasInterface } from '../../../../../shared/interfaces/formulas.interface';
import { INVOICE } from '../../../$moduleName/$moduleName-routing.module';
import { FORM } from '../../../$moduleName/$moduleName-routing.module';
import { ${subModuleName}ApiService } from '../../data-access/$subModuleName/services/$subModuleName-api.service';
import { ${subModuleName}Interface } from '../../data-access/${subModuleName}/interfaces/${subModuleName}.interface';
import { ${subModuleName}FilterInterface } from '../../data-access/$subModuleName/interfaces/$subModuleName-filter.interface';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { ApnInterface } from '../../../../../shared/interfaces/apn.interface';
import { FirstLevelInterface } from '../../../../../shared/interfaces/first-level.interface';
import { ThirdLevelInterface } from '../../../../../shared/interfaces/third-level.interface';

const etape_values = [BADGE_ETAPE.SOUMISSION, BADGE_ETAPE.TRAITEMENT];
const etat_values = [BADGE_ETAT.RECU, BADGE_ETAT.EN_COURS, BADGE_ETAT.TERMINE];
type PageAction = { data: Folder, action: 'open-folder-$moduleName' | 'invoice-$moduleName' | 'mass-edit-$moduleName' | 'simple-add-$moduleName' | 'mass-add-$moduleName', view: 'page' };

    @Component({
        selector: 'app-$subModuleName',
        templateUrl: `./$subModuleName.component.html`
    })

    export class ${subModuleName}Component implements OnInit {
        public module: string;
        public subModule: string;
        public pagination$': Observable<Paginate<${subModuleName}Interface>>;
        public filterData: ${subModuleName}FilterInterface;
        public list${subModuleName}: Array<$subModuleName > = [];
        public list${subModuleName}$': Observable<Array<${subModuleName}Interface>>;
        public listUsages$': Observable<Array<UsageInterface>>;
        public listApn$': Observable<Array<ApnInterface>>;
        public listFormulas$': Observable<Array<FormulasInterface>>;
        public listFirstLevel$': Observable<Array<FirstLevelInterface>>;
        public listThirdLevel$': Observable<Array<ThirdLevelInterface>>;
        public listAlarms: Array<TypeAlarme> = [];
        public listStep$subModuleName : Array<T_BADGE_ETAPE> = step_values;
        public listState$subModuleName : Array<T_BADGE_ETAT> = state_values;
        public listApplicants$': Observable<any[]>;

        constructor(private router: Router, private sharedService: SharedService,
            private activatedRoute: ActivatedRoute,
            private ${subModuleName}ApiService: ${subModuleName}ApiService) {
        }

        ngOnInit(): void {
            this.activatedRoute.data.subscribe((data) => {
                this.module = data['module'];
                this.subModule = data['subModule'][1];
            });
            this.sharedService.fetchUsages();
            this.listUsages$ = this.sharedService.getUsages();
            this.sharedService.fetchFormulas();
            this.listFormulas$ = this.sharedService.getFormulas();
            this.sharedService.fetchApn();
            this.listApn$ = this.sharedService.getApn();
            this.sharedService.fetchFirstLevel();
            this.listFirstLevel$ = this.sharedService.getFirstLevel();;
            this.sharedService.fetchThirdLevel();
            this.listThirdLevel$ = this.sharedService.getThirdLevel();
            this.sharedService.fetchApplicants({});
            this.listApplicants$ = this.sharedService.getApplicants();
            this.list${subModuleName}$ = this.${subModuleName}ApiService.get${subModuleName}();
            this.pagination$ = this.${subModuleName}ApiService.get${subModuleName}Pagination();

            combineLatest([
                this.${subModuleName}ApiService.getDataFilter${subModuleName}(),
                this.${subModuleName}ApiService.getDataNbrPage${subModuleName}()
            ]).subscribe(([filterData, nbrPageData]) => {
                this.${subModuleName}ApiService.fetch${subModuleName}(filterData, nbrPageData);
            });
        }

        public filter(filterData: ${subModuleName}FilterInterface): void {
            this.filterData = filterData;
            this.sharedService.fetch${subModuleName}(filterData)
        }

        public onPageChange(event: number): void {
            this.${subModuleName}ApiService.fetch${subModuleName}(this.filterData, JSON.stringify(event + 1))
        }

        public navigateByUrl(params: PageAction): void {
            const number_demand = params.data ? params.data["numero_demande"] : null;
            const ref = params.action;
            const operation = OperationTransaction.ACTIVATION;
            const current_page = this.pagination?.['current_page'] || 1;
            const queryParams = { ref, operation, current_page };
            let routePath: string = '';

            switch (params.action) {
            case "invoice-${subModuleName}": routePath = '${INVOICE}/${number_demand}'; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
            case "open-folder-${subModuleName}": routePath = '${number_demand}'; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
            case "mass-edit-${subModuleName}":
            case "simple-add-${subModuleName}": routePath = FORM; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams: { ...queryParams, operation: OperationTransaction.ACTIVATION } }); break;
            case "mass-add-${subModuleName}": routePath = FORM; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams: { ...queryParams, operation: OperationTransaction.ACTIVATION_EN_MASSE } }); break;
            }
        }
    }
"@
    Clear-Content "$uiPath/$subModuleName.component.ts"
    Add-Content "$uiPath/$subModuleName.component.ts" -Value $tsContent



    Write-Host "✅ Module ui pour '$subModuleName' généré avec succès."
}
else {
    Write-Host "⚠️ Le dossier '$uiPath' existe déjà."
}
