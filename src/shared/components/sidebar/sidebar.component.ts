import { filter } from 'rxjs/operators';
import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Menu, NavService } from '../../services/nav.service';
import { LayoutService } from '../../services/layout.service';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { ADMIN_USER, DASHBOARD } from 'src/shared/routes/routes';
import { ADMIN_ACHAT, ADMIN_ACTIVATION_HISTORIE, ADMIN_CLIENT, ADMIN_GROUPE, ADMIN_POINT_VENTE, ADMIN_PRODUCT, ADMIN_STOCK, ADMIN_VENTE } from 'src/presentation/pages/administration/administration-routing.module';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {

  public iconSidebar;
  public menuItems: Menu[];
  public filterArray: Array<any> = [];
  public filterArray2: Array<any> = [];

  public url: any;
  public fileurl: any;

  // For Horizontal Menu
  public margin: any = 0;
  public width: any = window.innerWidth;
  public leftArrowNone: boolean = true;
  public rightArrowNone: boolean = false;
  public data: any = [];

  constructor(
    private router: Router,
    public navServices: NavService,
    public layout: LayoutService,
    private storage: EncodingDataService
  ) {
    let user = JSON.parse(this.storage.getData('user') || null);
    if (user?.profil?.slug === 'utilisateur') {
      this.data.push(
        {
          title: "Tableau de bord",
          icon: "home",
          type: "link",
          path: `/${DASHBOARD}`,
          statut: true,
        },
        {
          title: "Votre Stock",
          icon: "trending-up",
          type: "link",
          path: `/${ADMIN_USER}/${ADMIN_STOCK}`,
          statut: true,
        },
        {
          title: "Vos Ventes",
          icon: "activity",
          type: "link",
          path: `/${ADMIN_USER}/${ADMIN_VENTE}`,
          statut: true,
        },
        {
          title: "Vos Achats",
          icon: "shopping-cart",
          type: "link",
          path: `/${ADMIN_USER}/${ADMIN_ACHAT}`,
          statut: true,
        },
        {
          title: "Vos Produits & Services",
          icon: "package",
          type: "link",
          path: `/${ADMIN_USER}/${ADMIN_PRODUCT}`,
          statut: true,
        },
        {
          title: "Objectifs & Performances",
          icon: "life-buoy",
          type: "sub",
          statut: true,
          expanded: true,
          children: [
            {
              title: "Objectifs",
              type: "link",
              path: ``,
              statut: true,
            },
            {
              title: "Réalisations [Rapport]",
              type: "link",
              path: ``,
              statut: true,
            }
          ]
        },
        {
          title: "Vos Clients",
          icon: "users",
          type: "sub",
          statut: true,
          expanded: true,
          children: [
            {
              title: "Votre liste de Clients",
              type: "link",
              path: `/${ADMIN_USER}/${ADMIN_CLIENT}`,
              statut: true,
            },
            {
              title: "Vos groupes de ventes",
              type: "link",
              path: `/${ADMIN_USER}/${ADMIN_GROUPE}`,
              statut: true,
            },
            {
              title: "Points de ventes",
              type: "link",
              path: `/${ADMIN_USER}/${ADMIN_POINT_VENTE}`,
              statut: true,
            },
            {
              title: "Historique activations",
              type: "link",
              path: `/${ADMIN_USER}/${ADMIN_ACTIVATION_HISTORIE}`,
              statut: true,
            },
          ]
        },
      )
    } else {
      this.data = JSON.parse(this.storage.getData('current_menu') || null);
      this.data?.unshift({
        title: "Tableau de bord",
        icon: "home",
        type: "link",
        path: `/${DASHBOARD}`,
        statut: true,
      })
    }

    this.data.map(item => {
      if (item.statut === true) {
        this.filterArray.push(item);
        this.filterArray.map((d) => {
          if (d?.children) {
            d.children.map((value, index) => {
              if (!user.permissions.includes(value.data)) {
                d.children.splice(index, 1);
              }
            })
          }
        });
      }
    });

    this.menuItems = this.filterArray;
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
