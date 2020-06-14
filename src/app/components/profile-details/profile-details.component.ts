import {Component, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from "rxjs/Observable";
import {MerchantApiService} from "../../services/api/merchant-api.service";
import {DictionariesService} from "../../services/api/dictionaries-api.service";
import {DatePipe} from "@angular/common";
import {RequestsService} from "../../services/http-interceptors/requests.service";

@Component({
    selector: 'app-profile-details',
    templateUrl: './profile-details.component.html',
    styleUrls: ['./profile-details.component.scss'],
    animations: [routerTransition()]
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
    public MASDetails: Observable<any>;
    public profileDetails: Object;
    public dictionaries: Object;
    public businessTypeList: Array<Object> = [];
    public genderTypeList: Array<Object> = [];
    model: NgbDateStruct;
    model2: NgbDateStruct;
    model3: NgbDateStruct;
    public selectedSimpleItem: any;
    public selectedSimpleItem2: any;
    date: { year: number, month: number };

    constructor(public profile: MerchantApiService,
                private requests: RequestsService,
                public dictionaryService: DictionariesService,
                private datePipe: DatePipe) {
        const that = this;
        this.MASDetails = profile.getMerchantProfileDetails();
        this.MASDetails.subscribe((data) => {
            // console.log('getMerchantProfileDetails, ', data);
            that.profileDetails = data;
            //that.profileDetails['activityStartDate'] = that.getFormattedDate(that.profileDetails['activityStartDate']);
            //that.profileDetails['personalDetails']['nationalIdNumberDate'] =
            //    that.getFormattedDate(that.profileDetails['personalDetails']['nationalIdNumberDate']);
            //that.profileDetails['personalDetails']['birthDate'] =
            //    that.getFormattedDate(that.profileDetails['personalDetails']['birthDate']);
            that.dictionaryService.getDictionaries(function (data) {
                that.genderTypeList = that.getArrayFromObject(data['genders']);
                that.businessTypeList = that.getArrayFromObject(data['businessTypes']);
                // console.log(data, that.genderTypeList, that.businessTypeList);
            });
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.MASDetails.subscribe().unsubscribe();
        this.requests.unsubscribeRequests();
    }

    private getFormattedDate(date) {
        return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss');
    }

    private getArrayFromObject(obj) {
        let arr = [];
        for (let prop in obj) {
            if (!obj.hasOwnProperty(prop)) continue;
            arr.push({
                code: prop,
                description: obj[prop]['title']
            });
        }
        return arr;
    }

    closeOutsideDatePicker(ev, el) {
        if (!el.isOpen() || ev.target.id == el
            || (ev.target.offsetParent && ev.target.offsetParent.localName.includes('ngb-datepicker'))
            || !(ev.target.parentElement && ev.target.parentElement.parentElement
                && !ev.target.parentElement.parentElement.localName.includes('ngb-datepicker'))) {
            return;
        }
        if (el.isOpen() && ev.target.id != el) {
            el.close();
        }
    }
}
