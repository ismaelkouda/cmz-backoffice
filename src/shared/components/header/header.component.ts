import { NotifyService } from './../../services/notify.service';
import { Component, OnInit, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { NavService } from "../../services/nav.service";
import { LayoutService } from "../../services/layout.service";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
// @ts-ignore
import { MappingService } from "src/shared/services/mapping.service";
import { ApplicationType } from "src/shared/enum/ApplicationType.enum";
import { Router } from "@angular/router";
import { NOTIFY_ROUTE } from "src/presentation/pages/supervision-operations/supervision-operations-routing.module";
import { SUPERVISION_OPERATIONS } from "src/shared/routes/routes";
import { ToastrService } from 'ngx-toastr';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { StoreLocaleService } from 'src/shared/services/store-locale.service';

SwiperCore.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {

  public elem: any;
  public profil: any;
  public logoTenant: string;
  public minioUrl: string;
  public appName: string;
  public applicationType: string;
  public patrimoineType: string;
  public soldeGlobal: string;
  public ligneCreditGlobal: string;
  public countNotify: number = 0

  constructor(
    public layout: LayoutService,
    public navServices: NavService,
    @Inject(DOCUMENT) private document: any,
    private mappingService: MappingService,
    private router: Router,
    private notifyService: NotifyService,
    private toastrService: ToastrService,
    private storage: EncodingDataService,
    private storeLocaleService: StoreLocaleService
    
  ) {
    this.statutLayout();
    this.minioUrl = this.mappingService.minioUrl;
    this.appName = this.mappingService.appName;  
    this.applicationType = this.mappingService.applicationType;
    this.patrimoineType = ApplicationType.PATRIMOINESIM;
    this.storeLocaleService._notify$.subscribe((res: any) => {
      if (res) {
        this.countNotify = res
      }else{
        let user = JSON.parse(this.storage.getData('user') || null);    
        if (user !== null) {
           this.countNotify = user.notifications
        }else{
          this.countNotify = this.mappingService.notifications
        }
      }
    });
  }

  ngOnInit() {
    this.elem = document.documentElement;
    this.profil = this.mappingService.currentUser
    this.logoTenant = this.mappingService.logoTenant;
    this.mappingService.volumeDataGlobal$.subscribe((res: any) => {
      this.soldeGlobal = res
    });
    this.mappingService.ligneCreditGlobal$.subscribe((res: any) => {      
      this.ligneCreditGlobal = res
    });
    this.notifyService.onData().subscribe((data: any) => {
      this.OncountNotify()
    });
  }
  public OncountNotify() {
    this.notifyService
      .OncountNotify()
      .subscribe({
        next: (response) => {          
          let user = JSON.parse(this.storage.getData('user'));
          this.countNotify = response['data']
          user.notifications = response['data'];
          this.storage.saveData('user', JSON.stringify(user));
          this.toastrService.success(response['message'])
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }


  OnGoNotif(){
    this.router.navigateByUrl(`${SUPERVISION_OPERATIONS}/${NOTIFY_ROUTE}`)
  }

  public pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }

  statutLayout(): boolean {
    return localStorage.getItem('layout') === 'Barcelona' ? true : false
  }

}
