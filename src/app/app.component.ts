import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {AuthorizationResult, OidcSecurityService} from 'angular-auth-oidc-client';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from "rxjs/Subscription";
import {DOCUMENT} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {NgbDateCustomParserFormatter} from "./services/ngb-date-custom-parser-formatter";
import {LocalstorageService} from "./services/localstorage.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}]
})
export class AppComponent implements OnInit {
    navIsFixed: boolean;
    modeIsLTR: boolean;

    currentLang: string;

    userDataSubscription: Subscription;
    userData: any;

    constructor(public oidcSecurityService: OidcSecurityService,
                @Inject(DOCUMENT) private document: Document,
                private translateService: TranslateService,
                private localstorageService: LocalstorageService,
                public router: Router) {
    }

    public changeModeScrollBtn() {
        // this.modeIsLTR = !this.modeIsLTR;
    }

    ngOnInit() {
        this.currentLang = this.localstorageService.read('lang') || 'he';
        this.modeIsLTR = this.currentLang !== 'he';
        // const language = window.navigator['userLanguage'] || window.navigator.language;
        // if (language.match(/^[^-]*[^ -]/)) {
        //     switch (language.match(/^[^-]*[^ -]/)[0]) {
        //         case 'he':
        //             this.translateService.setDefaultLang('he');
        //             break;
        //         case 'en':
        //             this.translateService.setDefaultLang('en');
        //             break;
        //         default:
        //             this.translateService.setDefaultLang('he');
        //     }
        // }
        // else {
        //     this.translateService.setDefaultLang('he');
        // }
        if (this.oidcSecurityService.moduleSetup) {
            this.onOidcModuleSetup();
        } else {
            this.oidcSecurityService.onModuleSetup.subscribe(() => {
                this.onOidcModuleSetup();
            });
        }

        // this.router.routeReuseStrategy.shouldReuseRoute = function(){
        //     return false;
        // };

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            // if (evt instanceof NavigationEnd) {
            //     this.router.navigated = false;
            // }
            window.scrollTo(0, 0);
        });

        // this.userDataSubscription = this.oidcSecurityService.getUserData().subscribe(
        //     (userData: any) => {
        //         this.userData = userData;
        //         console.log(userData);
        //     });
    }

    @HostListener("window:scroll", [])
    onWindowScroll() {
        if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
            this.navIsFixed = true;
        } else if (this.navIsFixed && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
            this.navIsFixed = false;
        }
    }

    scrollToTop() {
        (function smoothscroll() {
            let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, currentScroll - (currentScroll / 5));
            }
        })();
    }

    ngOnDestroy(): void {
        this.oidcSecurityService.onModuleSetup.unsubscribe();
    }

    login() {
        console.log('start login');
        this.oidcSecurityService.authorize();
    }

    refreshSession() {
        console.log('start refreshSession');
        this.oidcSecurityService.authorize();
    }

    // logout() {
    //     console.log('start logoff');
    //     this.oidcSecurityService.logoff();
    // }

    private onOidcModuleSetup() {
        if (window.location.hash) {
            console.log('oidcSecurityService.authorizedCallback()');
            this.oidcSecurityService.authorizedCallback();
        } else {
            console.log('start oidcSecurityService.getIsAuthorized()');
            this.oidcSecurityService.getIsAuthorized().subscribe((authorized: boolean) => {
                if (!authorized) {
                    //console.log('start oidcSecurityService.authorize()');
                    //this.oidcSecurityService.authorize();
                    console.log("!authorized");
                    this.router.navigate(['/autologin']);
                }
                else {
					this.router.navigate(['/dashboard']);
                    // console.log('start userService.getUserData()');
                    // this.userService.getUserData(() => {
                    //     console.log('start dictionaryService.getDictionaries()');
                    //     this.dictionaryService.getDictionaries(() => {
                    //     });
                    // }, () => {
                    // });
                }
            });
        }
        this.oidcSecurityService.onAuthorizationResult.subscribe(
            (authorizationResult: AuthorizationResult) => {
                // console.log("oidcSecurityService.onAuthorizationResult");
                this.onAuthorizationResultComplete(authorizationResult);
            });
    }

    private onAuthorizationResultComplete(authorizationResult: AuthorizationResult) {
        // const path = this.storageService.read('redirect');
        console.log('onAuthorizationResultComplete');
        if (authorizationResult === AuthorizationResult.authorized) {
            // console.log("authorizationResult == AuthorizationResult.authorized");
            this.router.navigate(['/dashboard']);
            // this.userService.getUserData((data) => {
            //     console.log('onAuthorizationResultComplete -> userService.getUserData()');
            //     this.storageService.write('userData', data);
            //     this.dictionaryService.getDictionaries(() => {
            //         this.router.navigate(['/dashboard']);
            //     });
            // }, () => {
            // });
            // if (path) this.router.navigate([path]);
        }
        else {
            // console.log("authorizationResult != AuthorizationResult.authorized");
            this.router.navigate(['/unauthorized']);
        }
    }
}
