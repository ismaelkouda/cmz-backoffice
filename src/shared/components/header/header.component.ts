import { Component, OnInit, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { NavService } from "../../services/nav.service";
import { LayoutService } from "../../services/layout.service";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
// @ts-ignore
import appConfig from '../../../assets/config/app-config.json';
import { MappingService } from "src/shared/services/mapping.service";
import { ApplicationType } from "src/shared/enum/ApplicationType.enum";
import { Router } from "@angular/router";
import { NOTIFY_ROUTE } from "src/presentation/pages/supervision-operations/supervision-operations-routing.module";
import { SUPERVISION_OPERATIONS } from "src/shared/routes/routes";

SwiperCore.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {

  public elem: any;
  public typeLayout;
  public headerTitle: string;
  public profil: any;
  public logoTenant: string;
  public minioUrl: string;
  public appName: string;
  public applicationType: string;
  public patrimoineType: string;
  public soldeGlobal: string;
  public ligneCreditGlobal: string;

  
  constructor(
    public layout: LayoutService,
    public navServices: NavService,
    @Inject(DOCUMENT) private document: any,
    private mappingService: MappingService,
    private router: Router
    
  ) {
    this.statutLayout();
    this.headerTitle = appConfig?.titlePage;
    this.minioUrl = this.mappingService.minioUrl;  
    this.appName = this.mappingService.appName;  
    this.applicationType = this.mappingService.applicationType;
    this.patrimoineType = ApplicationType.PATRIMOINESIM;
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
  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
    this.navServices.megaMenu = false;
    this.navServices.levelMenu = false;
  }

  layoutToggle() {
    if ((this.layout.config.settings.layout_version = "dark-only")) {
      document.body.classList.toggle("dark-only");
    }
    document.body.remove;
  }

  searchToggle() {
    this.navServices.search = true;
  }

  languageToggle() {
    this.navServices.language = !this.navServices.language;
  }

  toggleFullScreen() {
    this.navServices.fullScreen = !this.navServices.fullScreen;
    if (this.navServices.fullScreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    } else {
      if (!this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
