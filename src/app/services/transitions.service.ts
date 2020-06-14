import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';

@Injectable()
export class TransitionsService {
    merchant: Object = {};
    idUserForTransactions: number = null;
    isFromMerchantToBusinessReport: boolean = false;
    RTLToggleEmitter = new BehaviorSubject<boolean>(true);
    PageChangeEmitter = new BehaviorSubject<boolean>(true);
    LoadingProgressEmitter = new BehaviorSubject<boolean>(false);
    loadingProgressTimer: any;
    currentRTLToggle = this.RTLToggleEmitter.asObservable();
    currentPageStatus = this.PageChangeEmitter.asObservable();
    currentLoadingProgress = this.LoadingProgressEmitter.asObservable();
    previousUrl: string = '';
    currentUrl: string = '';
    currentLang: string;

    constructor(router: Router) {
        router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(e => {
                this.setPrevUrl(this.currentUrl);
                if (e) this.currentUrl = e['url'];
            });
    }

    private setPrevUrl(url: string) {
        this.previousUrl = url;
    }

    public transiteRTLToggle(data: boolean) {
        this.RTLToggleEmitter.next(data);
    }

    public transitePageChange(data: any) {
        this.PageChangeEmitter.next(data);
    }

    public transiteLoadingProgress(data: boolean) {
        // if (data === true) {
        //     this.loadingProgressTimer = setTimeout( () => {
        //         this.LoadingProgressEmitter.next(true);
        //     }, 500);
        // }
        // else {
        //     clearTimeout(this.loadingProgressTimer);
        //     this.LoadingProgressEmitter.next(false);
        // }
        this.LoadingProgressEmitter.next(data);
    }


    public setMerchantData(data: Object) {
        this.merchant = data;
    }

    public setUserForTransaction(id: number) {
        this.idUserForTransactions = id;
    }

    public setUserForBusinessReports(id: number) {
        this.isFromMerchantToBusinessReport = true;
        this.setUserForTransaction(id);
    }
}
