import {Component, ElementRef, OnInit} from '@angular/core';
import {DictionariesService} from "../services/api/dictionaries-api.service";
import {UserApiService} from "../services/api/user-api.service";
import {TransitionsService} from "../services/transitions.service";
import {LocalstorageService} from "../services/localstorage.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
    pushRightClass: string = 'push-right';
    isRTLToggle: boolean = false;
    isSafariBrowser: boolean;
    currentLang: string;

    constructor(private dictionaryService: DictionariesService,
                private localstorageService: LocalstorageService,
                private userService: UserApiService,
                private _eref: ElementRef,
                public translateService: TranslateService,
                private transitionService: TransitionsService) {
    }

    ngOnInit() {
        this.currentLang = this.localstorageService.read('lang') || 'he';
        this.isRTLToggle = this.currentLang === 'he';
        this.translateService.use(this.currentLang);
        // this.transitionService.currentRTLToggle.subscribe(data => this.isRTLToggle = data);
        this.isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        // console.log(this.isSafariBrowser);
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

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

}
