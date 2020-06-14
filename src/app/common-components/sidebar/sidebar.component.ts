import {Component, ElementRef, Inject, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {TransitionsService} from "../../services/transitions.service";
import {DOCUMENT} from "@angular/common";
import {LocalstorageService} from "../../services/localstorage.service";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    host: {
        '(window:click)': 'onClick($event)',
    },
})
export class SidebarComponent implements OnInit {
    public isMenuWideOpened: boolean = true;
    public isRTLToggle: boolean = true;
    isUnauthorized: boolean = false;
    isActive: boolean = false;
    showMenu: string = '';
    pushRightClass: string = 'push-right';
    currentLang: string;

    isStandardMode: boolean;

    constructor(private translate: TranslateService,
                private translateService: TranslateService,
                public transitionService: TransitionsService,
                private localstorageService: LocalstorageService,
                public router: Router,
                private _eref: ElementRef,
                @Inject(DOCUMENT) private document: Document,
                public oidcSecurityService: OidcSecurityService) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de']);
        // this.translate.setDefaultLang('he');
        // const browserLang = this.translate.getBrowserLang();
        // this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        // this.transitionService.currentRTLToggle.subscribe(data => this.isRTLToggle = data);
        this.currentLang = this.localstorageService.read('lang') || 'he';
        // this.translateService.use(this.currentLang);
        this.isRTLToggle = this.currentLang === 'he';
        this.isStandardMode = this.currentLang !== 'he';
        // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        //     this.isRTLToggle = event.lang === 'he';
        //     this.isStandardMode = event.lang !== 'he';
        // });
    }


    onClick(event) {
        // console.log(event.target);
        // console.log(this._eref.nativeElement.contains(event.target), this.document.body.classList.contains('push-right'));
        if (!this._eref.nativeElement.contains(event.target) &&
            this.document.body.classList.contains('push-right') &&
            event.target['className'] !== 'navbar-toggler') {
            this.toggleSidebar();
        }
    }

    toggleNavWidth() {
        const componentShell = document.getElementsByClassName('main-container')[0];
        if (this.isMenuWideOpened) {
            componentShell.classList.remove('nav-menu-wide');
            componentShell.classList.add('nav-menu-hide');
        }
        else {
            componentShell.classList.remove('nav-menu-hide');
            componentShell.classList.add('nav-menu-wide');
        }
        this.isMenuWideOpened = !this.isMenuWideOpened;
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    logout() {
        //this.oidcSecurityService.logoff();
        window.location.href = environment.load_using_stsServer + "/account/logout";
    }
}
