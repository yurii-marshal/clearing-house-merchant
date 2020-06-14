import {Component, ElementRef, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UserApiService} from "../../services/api/user-api.service";
import {TransitionsService} from "../../services/transitions.service";
import {AppComponent} from "../../app.component";
import {LocalstorageService} from "../../services/localstorage.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass: string = 'push-right';
    isRTLToggle: boolean;
    currentLang: string;
    user: Object;

    constructor(private translate: TranslateService,
                private userService: UserApiService,
                public transitionService: TransitionsService,
                private localstorageService: LocalstorageService,
                public appCtrl: AppComponent,
                public router: Router) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        // this.translate.setDefaultLang('he');
        // this.rltAndLtr();
        // const browserLang = this.translate.getBrowserLang();
        // this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

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
        // this.userService.getUserData(function (data) {
        //     console.log(data);
        //     that.user = data;
        // });
        this.currentLang = this.localstorageService.read('lang') || 'he';
        // this.isRTLToggle = this.currentLang === 'he';
        if (this.currentLang === 'he') this.rltAndLtr();

        // this.transitionService.currentRTLToggle.subscribe((data) => {
        //     this.isRTLToggle = data;
            // this.isRTLToggle = this.currentLang === 'he';
            // console.log(this.currentLang);
        // });
    }

    // onClick(event) {
    //     if (!this._eref.nativeElement.contains(event.target)) {
    //         console.log(event);
    //     }
    // }

    onClickOutside(event) {
        // console.log(event);
    }

    public setTranslationLanguage(lang: string) {
        this.currentLang = lang;
        this.localstorageService.write('lang', lang);
        location.reload();
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    hideSidebar() {
        if (window.innerWidth < 768) {
            const dom: any = document.querySelector('body');
            // console.log(this.isToggled());
            if (!this.isToggled()) {
                dom.classList.remove(this.pushRightClass);
            }
        }
    }

    rltAndLtr() {
        this.isRTLToggle = !this.isRTLToggle;
        this.transitionService.transiteRTLToggle(this.isRTLToggle);
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
        this.appCtrl.changeModeScrollBtn();
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
