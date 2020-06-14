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
    selector: 'app-transaction-reports',
    templateUrl: './transaction-reports.component.html',
    styleUrls: ['./transaction-reports.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})

export class TransactionReportsComponent implements OnInit, OnDestroy {
    public isAdminRoleBilling: boolean = false;
    public tabIndex: number;
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
        transactionsReport: {
            paymentGatewayID: null,
            paymentAmountFrom: null,
            paymentAmountTo: null,
            solic: '',
            creditCardVendor: '',
            consumerEmail: '',
            consumerPhone: '',
            consumerName: '',
            dealDescription: '',
            dealReference: '',
            terminalReference: '',
            transactionType: null
        }
    };

    public transactionTypeFilter: Array<Object>;

    isRTLToggle: boolean = false;

    reportsStatusFilter: any;
    selectedReportsPeriod: any = 'daily';
    reportsTransactionPeriodLabels: any;
    reportsTransactionPeriodFilter: any;
    reportsPeriodFilter: any;
    tableTransactionsReportsListFilter: Object;
    currentOrderBy: Object;

    isColumnsFilterEmpty = true;

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
        //     console.log(event.lang);
        //     this.transitionsService.currentLang = event.lang;
        //     this.initDrops();
        // });
        // this.placementPosition = window.innerWidth < 768 ? 'bottom-left' : 'bottom-right';
        if (window.innerWidth >= 768) {
            this.placementPosition = this.storageService.read('lang') === 'he' ? 'bottom-left' : 'bottom-right';
        }
        else {
            this.placementPosition = 'bottom-left';
        }
    }

    ngOnInit() {
        if (this.storageService.read('reportsFilterGroup') != null) {
            this.filterGroup = this.storageService.read('reportsFilterGroup');
            this.toggleFilterSection = true;
        }
        const that = this;

        // this.transitionsService.currentRTLToggle.subscribe(() => {
        //     that.isRTLToggle = true;
        // });

        // this.transitionsService.currentRTLToggle.subscribe((data) => {
        //     if (window.innerWidth >= 768) {
        //         this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
        //     }
        // });

        this.transitionsService.setMerchantData({});
        this.dictionaryService.getDictionaries(function (convertedDTO) {
            that.reportsStatusFilter = convertedDTO['kycStatuses'];
            that.transactionTypeFilter = that.dictionaryService.dictionaries['transactionStatuses'];

        });
        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );
        this.reportsTransactionPeriodLabels = ['Daily', 'Monthly', 'Last 30 Days', 'Last 12 Months'];
        this.reportsTransactionPeriodFilter = [
            {
                code: 'daily',
                description: ''
            },
            {
                code: 'monthly',
                description: ''
            },
            {
                code: 'last30Days',
                description: ''
            },
            {
                code: 'last12Months',
                description: ''
            }
        ];
        this.reportsPeriodFilter = [
            {
                code: 'today',
                description: 'Today'
            },
            {
                code: 'yesterday',
                description: 'Yesterday'
            },
            {
                code: 'lastWeek',
                description: 'Last Week'
            },
            {
                code: 'lastMonth',
                description: 'Last Month'
            }
        ];
        this.storageService.read('tableTransactionsReportsListFilter') ?
            this.tableTransactionsReportsListFilter = this.storageService.read('tableTransactionsReportsListFilter') :
            this.tableTransactionsReportsListFilter = {
                date: {
                    title: "Date",
                    checkbox: true,
                },
                month: {
                    title: "Month",
                    checkbox: true,
                },
                year: {
                    title: "Year",
                    checkbox: true,
                },
                currency: {
                    title: "Currency",
                    checkbox: true,
                },
                totalAmount: {
                    title: "Total Amount",
                    checkbox: true,
                },
                totalCommission: {
                    title: "Total Commission",
                    checkbox: true,
                },
                transactionsCount: {
                    title: "Transactions Count",
                    checkbox: true,
                },
                merchantAmmount: {
                    title: "Merchant Amount",
                    checkbox: true,
                },
                refundTransactionsAmount: {
                    title: "Refund Transactions Amount",
                    checkbox: true,
                },
                refundTransactionsCommission: {
                    title: "Refund Transactions Commission",
                    checkbox: true,
                },
                refundTransactionsCount: {
                    title: "Refund Transactions Count",
                    checkbox: true,
                },
                rejectedTransactionsCount: {
                    title: "Average Amount",
                    checkbox: true,
                },
                touristCharges: {
                    title: "Tourist Charges",
                    checkbox: true,
                }
            };
        this.getList(0);

        this.initDrops();
        this.checkColumnsFilterEmpty();
    }

    ngOnDestroy() {
        // this.storageService.remove('tableTransactionsReportsListFilter');
        this.requests.unsubscribeRequests();
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.tableTransactionsReportsListFilter) {
            if (this.tableTransactionsReportsListFilter[item]['checkbox'] === false) {
                this.isColumnsFilterEmpty = false;
                break;
            }
        }
    }

    public onColumnsChangeTransactions() {
        this.checkColumnsFilterEmpty();
        this.storageService.write('tableTransactionsReportsListFilter', this.tableTransactionsReportsListFilter);
    }

    private initDrops() {
        this.reportsTransactionPeriodFilter.forEach((item, index) => {
            let tmpFilter = this.reportsTransactionPeriodFilter.slice();
            this.translate.get(this.reportsTransactionPeriodLabels[index])
                .subscribe(res => {
                    tmpFilter[index].description = res;
                    this.reportsTransactionPeriodFilter = tmpFilter.slice();
                });
        });
    }

    public getList(skip) {
        const requestUrl = {
            take: this.pageSize,
            skip: skip,
            order: this.currentOrderBy,
            dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
            dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
            status: this.getKeysStatusFilter(),
            filterGroup: this.filterGroup['transactionsReport']
        };

        this.reportsService.getReportsTransactionList(
            this.selectedReportsPeriod,
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

        this.reportsService.getReportsTransactionList(
            'lastTenDaysExcel',
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

    private setDailyPeriod(today) {
        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
        this.tablePeriodTo = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
    }

    private setMonthlyPeriod(today, tmpDate) {
        const lastMonth = new Date(tmpDate.setDate(tmpDate.getDate() - 30));
        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
            lastMonth.getUTCFullYear(),
            lastMonth.getUTCMonth() + 1,
            lastMonth.getUTCDate());
        this.tablePeriodTo = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
    }

    private set30DaysPeriod(today, tmpDate) {
        const lastTenDays = new Date(tmpDate.setDate(tmpDate.getDate() - 30));
        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
            lastTenDays.getUTCFullYear(),
            lastTenDays.getUTCMonth() + 1,
            lastTenDays.getUTCDate());
        this.tablePeriodTo = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
    }

    private set12MonthsPeriod(today, tmpDate) {
        const lastYear = new Date(tmpDate.setDate(tmpDate.getDate() - 365));
        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
            lastYear.getUTCFullYear(),
            lastYear.getUTCMonth() + 1,
            lastYear.getUTCDate());
        this.tablePeriodTo = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
    }

    public onPeriodFilterChange() {
        const today = new Date();
        const tmpDate = new Date();
        // console.log(this.selectedReportsPeriod);
        switch (this.selectedReportsPeriod) {
            case 'daily':
                this.setDailyPeriod(today);
                break;
            case 'monthly':
                this.setMonthlyPeriod(today, tmpDate);
                break;
            case 'last30Days':
                this.set30DaysPeriod(today, tmpDate);
                break;
            case 'today':
                this.setDailyPeriod(today);
                break;
            case 'yesterday':
                const yesterday = new Date(tmpDate.setDate(tmpDate.getDate() - 1));
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    yesterday.getUTCFullYear(),
                    yesterday.getUTCMonth() + 1,
                    yesterday.getUTCDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            case 'lastWeek':
                const lastWeek = new Date(tmpDate.setDate(tmpDate.getDate() - 7));
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    lastWeek.getUTCFullYear(),
                    lastWeek.getUTCMonth() + 1,
                    lastWeek.getUTCDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            case 'lastMonth':
                this.setMonthlyPeriod(today, tmpDate);
                break;
            case 'last12Months':
                this.set12MonthsPeriod(today, tmpDate);
                break;
            default:
                this.tablePeriodFrom = undefined;
                this.tablePeriodTo = undefined;
        }
        // console.log('onPeriodFilterChange: ', this.selectedReportsPeriod);
        // console.log(this.tablePeriodFrom, this.tablePeriodTo);
        this.page = 1;
        this.pageChange();
    }

    public onDateRangeChange() {
        // this.selectedReportsPeriod = null;
        this.page = 1;
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
