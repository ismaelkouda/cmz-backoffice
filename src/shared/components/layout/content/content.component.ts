import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as feather from 'feather-icons';
import { LayoutService } from '../../../services/layout.service';
import { NavService } from '../../../services/nav.service';
import { fadeInAnimation } from '../../../data/router-animation/router-animation';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    animations: [fadeInAnimation],
})
export class ContentComponent implements OnInit, AfterViewInit {
    constructor(
        private route: ActivatedRoute,
        public navServices: NavService,
        public layout: LayoutService,
        private router: Router
    ) {
        this.route.queryParams.subscribe((params) => {
            this.layout.config.settings.layout = params.layout
                ? params.layout
                : this.layout.config.settings.layout;
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            feather.replace();
        });
    }

    public getRouterOutletState(outlet) {
        return outlet.isActivated ? outlet.activatedRoute : '';
    }
    get layoutClass() {
        switch (window.localStorage.getItem('layout')) {
            case 'Paris':
                return 'compact-wrapper dark-sidebar';
            case 'Barcelona':
                return this.navServices.horizontal
                    ? 'horizontal-wrapper enterprice-type advance-layout'
                    : 'compact-wrapper enterprice-type advance-layout';
            default:
                return 'compact-wrapper dark-sidebar';
        }
    }

    ngOnInit() {}
}
