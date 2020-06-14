import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {DictionariesService} from "../../services/api/dictionaries-api.service";
import {FiltersService} from "../../services/filters.service";
import {TransitionsService} from "../../services/transitions.service";
import {RequestsService} from "../../services/http-interceptors/requests.service";
import {Router} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material";
import {ReportsApiService} from "../../services/api/reports-api.service";
import {UserApiService} from "../../services/api/user-api.service";
import {LocalstorageService} from "../../services/localstorage.service";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {CustomDatepickerI18n, I18n} from "../../services/ngb-datepicker-i18n.service";

export interface orderBy {
    activityStartDate: string;
    merchantID: string;
    riskRate: string;
    kycApprovalStatus: string;
    businessArea: string;
    phone: string;
}

@Component({
    selector: 'app-billing-reports',
    templateUrl: './billing-reports.component.html',
    styleUrls: ['./billing-reports.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})

export class BillingReportsComponent implements OnInit, OnDestroy {
    public isAdminRoleBilling: boolean = false;
    public merchant: Object;

    public reportsList: any;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    public filterGroup: Object = {
        activityReports: {
            actionType: '',
            doneBy: '',
            correlationId: ''
        }
    };

    isRTLToggle: boolean = false;

    reportsStatusFilter: any;
    selectedReportsPeriod: any = 'daily';
    reportsPeriodFilter: any;
    tableBusinessReportsListFilter: Object;
    currentOrderBy: Object;

    isColumnsFilterEmpty = true;

    datePlacement: string;

    public reportsActionTypeFilter: Array<Object>;

    public toggleFilterSection: boolean = false;

    public placementPosition: string;

    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    constructor(config: NgbDropdownConfig,
                public dictionaryService: DictionariesService,
                private storageService: LocalstorageService,
                public reportsService: ReportsApiService,
                public requests: RequestsService,
                public translate: TranslateService,
                public transitionsService: TransitionsService,
                public filtersService: FiltersService,
                private _eref: ElementRef,
                public userService: UserApiService,
                public router: Router) {
        config.placement = 'bottom-right';
        config.autoClose = "outside";
        this.selectConfig = config;
        // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        // console.log(event.lang);
        // this.transitionsService.currentLang = event.lang;
        // });
        // console.log(this.storageService.read('lang'));
        if (window.innerWidth >= 768) {
            this.datePlacement = this.storageService.read('lang') === 'he' ? 'bottom-right' : 'bottom-left';
            this.placementPosition = this.storageService.read('lang') === 'he' ? 'bottom-left' : 'bottom-right';
        }
        else {
            this.datePlacement = this.placementPosition = 'bottom-left';
        }
    }

    ngOnInit() {
        if (this.transitionsService.isFromMerchantToBusinessReport) {
            this.merchant = this.transitionsService.merchant;
        }

        // this.transitionsService.currentRTLToggle.subscribe(() => {
        //     that.isRTLToggle = true;
        // });

        // this.transitionsService.currentRTLToggle.subscribe((data) => {
        //     if (window.innerWidth >= 768) {
        //         this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
        //         this.datePlacement = data === false ? 'bottom-left' : 'bottom-right';
        //     }
        // });

        this.transitionsService.setMerchantData({});
        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );
        this.storageService.read('tableBusinessReportsListFilter') ?
            this.tableBusinessReportsListFilter = this.storageService.read('tableBusinessReportsListFilter') :
            this.tableBusinessReportsListFilter = {
                reportDate: {
                    title: "Date",
                    checkbox: true,
                },
                billableTransactionsTotal: {
                    title: "Billable Transactions Total",
                    checkbox: true,
                },
                comissionTotal: {
                    title: "Comission Total",
                    checkbox: true,
                },
                merchantTotal: {
                    title: "Merchant Total",
                    checkbox: true,
                },
                chargebackTotal: {
                    title: "Chargeback Total",
                    checkbox: true,
                },
                collateral: {
                    title: "Collateral",
                    checkbox: true,
                },
                toBeDeliveredTotal: {
                    title: "Delivered Total",
                    checkbox: true,
                },
                securityCycle: {
                    title: "Security Cycle",
                    checkbox: true,
                },
                currency: {
                    title: "Currency",
                    checkbox: true,
                },
                // balanceBefore: {
                //     title: "Balance Before",
                //     checkbox: true,
                // },
                // balanceAfter: {
                //     title: "Balance After",
                //     checkbox: true,
                // },
                isPayed: {
                    title: "Payed",
                    checkbox: true,
                },
            };
        this.getList(0);
        this.checkColumnsFilterEmpty();
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
        this.transitionsService.isFromMerchantToBusinessReport = false;
    }

    public onColumnsChangeBusiness() {
        this.checkColumnsFilterEmpty();
        this.storageService.write('tableBusinessReportsListFilter', this.tableBusinessReportsListFilter);
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.tableBusinessReportsListFilter) {
            if (this.tableBusinessReportsListFilter[item]['checkbox'] === false) {
                this.isColumnsFilterEmpty = false;
                break;
            }
        }
    }

    public getList(skip) {
        const requestUrl = {
            take: this.pageSize,
            skip: skip,
            order: this.currentOrderBy,
            dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
            dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
            status: this.getKeysStatusFilter()
        };
        if (this.transitionsService.isFromMerchantToBusinessReport)
            requestUrl['merchantID'] = this.transitionsService.idUserForTransactions;

        requestUrl['date'] = this.filtersService.getUTCDate(this.tablePeriodFrom);

        this.reportsService.getReportsBillingList(
            requestUrl,
            (data) => {
                // console.log(data);
                this.reportsList = data.data;
                this.collectionSize = data.numberOfRecords;
            });
    }

    public pageChange() {
        this.getList(this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0);
    }

    public refreshPage() {
        this.reportsList = [];
        this.collectionSize = 0;
        this.pageChange();
    }

    public downloadCurrentReportList() {
        const requestUrl = {
            merchantID: '',
            take: this.pageSize,
            skip: this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0
        };

        this.reportsService.getReportsBillingExcel(
            requestUrl,
            (data) => {
                // console.log(data);
                window.open(data['downloadUrl']);
            });
    }

    public setPositionIconStatus(icon: string) {
        this.orderBy[icon] = this.orderBy[icon] === 'ASC' ? 'DESC' : 'ASC';
        this.currentOrderBy = {
            prop: icon,
            order: this.orderBy[icon]
        };
        for (let i in this.orderBy) {
            if (i !== icon) {
                this.orderBy[i] = "";
            }
        }
        this.pageChange();
    }

    private getKeysStatusFilter() {
        const newStatusesObj = {};
        for (let prop in this.reportsStatusFilter) {
            if (!this.reportsStatusFilter.hasOwnProperty(prop)) continue;
            newStatusesObj[prop] = this.reportsStatusFilter[prop]['checkbox'];
        }
        return newStatusesObj;
    }

    public onDateRangeChange() {
        this.selectedReportsPeriod = null;
        this.pageChange();
    }

    public acceptFilters() {
        this.storageService.write('reportsFilterGroup', this.filterGroup);
        this.page === 1 ? this.pageChange() : this.page = 1;
    }

    public reloadConfigSelect($event) {
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
