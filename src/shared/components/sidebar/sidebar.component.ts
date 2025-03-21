import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Menu, NavService } from '../../services/nav.service';
import { LayoutService } from '../../services/layout.service';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import {  DASHBOARD, STRUCTURE_ORGANISATIONNELLE } from 'src/shared/routes/routes';
import { MappingService } from 'src/shared/services/mapping.service';
import { FIRST_LEVEL_ROUTE, SECOND_LEVEL_ROUTE, THRID_LEVEL_ROUTE, USAGE_METIER } from 'src/presentation/pages/structure-niveau/structure-niveau-routing.module';
import { LOGO_ORANGE } from 'src/shared/constants/logoOrange.constant';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {
  public LOGO_ORANGE = LOGO_ORANGE;
  public iconSidebar;
  public menuItems: Array<any>;
  public filterArray: Array<any> = [];
  public filterArray2: Array<any> = [];

  public url: any;
  public fileurl: any;

  // For Horizontal Menu
  public margin: any = 0;
  public width: any = window.innerWidth;
  public leftArrowNone: boolean = true;
  public rightArrowNone: boolean = false;
  public currentUser: any;
  public data: any = [];

  constructor(
    private router: Router,
    public navServices: NavService,
    public layout: LayoutService,
    private storage: EncodingDataService,
    private mappingService: MappingService
  ) {
    // let user = this.mappingService.currentUser;
    // this.data = this.mappingService.currentPermissions
   
    // this.data = JSON.parse(this.storage.getData('current_menu') || null);
    
    // this.data?.unshift({
    //   title: "Tableau de bord",
    //   icon: "home",
    //   type: "link",
    //   path: `/${DASHBOARD}`,
    //   statut: true,
    // })
    // if (this.data?.length > 1) {
    //   this.data?.push({
    //     title: `Structure Organisationnelle`,
    //     label: `Structure Organisationnelle`,
    //     data: "7-0-0-structure-orga",
    //     statut: true,
    //     icon: "bar-chart-2",
    //     url: "assets/images/portail/icone_settings.webp",
    //     path: `/${STRUCTURE_ORGANISATIONNELLE}/${FIRST_LEVEL_ROUTE}`,
    //     routerLink: ``,
    //     type: "sub",
    //     children: [
    //       {
    //         path: `/${STRUCTURE_ORGANISATIONNELLE}/${FIRST_LEVEL_ROUTE}`,
    //         title: `${mappingService.structureGlobale?.niveau_1_menu}`,
    //         label: `${mappingService.structureGlobale?.niveau_1_menu}`,
    //         data: "7-1-0-structure-orga-niveau-1",
    //         type: "link"
    //       },
    //       {
    //         path: `/${STRUCTURE_ORGANISATIONNELLE}/${SECOND_LEVEL_ROUTE}`,
    //         title: `${mappingService.structureGlobale?.niveau_2_menu}`,
    //         label: `${mappingService.structureGlobale?.niveau_2_menu}`,
    //         data: "7-2-0-structure-orga-niveau-2",
    //         type: "link"
    //       },
    //       {
    //         path: `/${STRUCTURE_ORGANISATIONNELLE}/${THRID_LEVEL_ROUTE}`,
    //         title: `${mappingService.structureGlobale?.niveau_3_menu}`,
    //         label: `${mappingService.structureGlobale?.niveau_3_menu}`,
    //         data: "7-3-0-structure-orga-niveau-3",
    //         type: "link"
    //       },
    //       {
    //         path: `/${STRUCTURE_ORGANISATIONNELLE}/${USAGE_METIER}`,
    //         title: `Usages Métier`,
    //         label: `Usages Métier`,
    //         data: "7-4-0-structure-orga-usage",
    //         type: "link"
    //       }
    //     ]
    //   })
    // }

    // this.data.map(item => {
    //   if (item.statut === true) {
    //     this.filterArray.push(item);
    //     this.filterArray.map((d) => {
    //       if (d?.children) {
    //         d.children.map((value, index) => {
    //           if (!user.permissions.includes(value.data)) {
    //             d.children.splice(index, 1);
    //           }
    //         })
    //       }
    //     });
    //   }
    // });
    this.storage.getData("menu")
    this.menuItems = JSON.parse(this.storage.getData("menu")) ?? [];
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menuItems.filter(items => {
          if (items.path === event.url) {
            this.setNavActive(items);
          }
          if (!items.children) { return false; }
          items.children.filter(subItems => {
            if (subItems.path === event.url) {
              this.setNavActive(subItems);
            }
            if (!subItems.children) { return false; }
            subItems.children.filter(subSubItems => {
              if (subSubItems.path === event.url) {
                this.setNavActive(subSubItems);
              }
            });
          });
        });
      }
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = event.target.innerWidth - 500;
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      if (menuItem !== item) {
        menuItem.active = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item)) {
          a.active = false;
        }
        if (!a.children) { return false; }
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
      });
    }
    item.active = !item.active;
  }


  // For Horizontal Menu
  scrollToLeft() {
    if (this.margin >= -this.width) {
      this.margin = 0;
      this.leftArrowNone = true;
      this.rightArrowNone = false;
    } else {
      this.margin += this.width;
      this.rightArrowNone = false;
    }
  }

  scrollToRight() {
    if (this.margin <= -3051) {
      this.margin = -3464;
      this.leftArrowNone = false;
      this.rightArrowNone = true;
    } else {
      this.margin += -this.width;
      this.leftArrowNone = false;
    }
  }


}
