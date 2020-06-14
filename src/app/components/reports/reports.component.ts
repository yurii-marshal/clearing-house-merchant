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
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})

export class ReportsComponent implements OnInit, OnDestroy {
    exp: boolean = true;
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
        },
        activityReports: {
            actionType: '',
            doneBy: '',
            correlationId: ''
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
    tableActivityReportsListFilter: Object;
    tableBusinessReportsListFilter: Object;
    currentOrderBy: Object;

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
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            // console.log(event.lang);
            this.transitionsService.currentLang = event.lang;
            this.initDrops();
        });
    }

    ngOnInit() {
        if (this.storageService.read('reportsFilterGroup') != null) {
            this.filterGroup = this.storageService.read('reportsFilterGroup');
            this.toggleFilterSection = true;
        }
        const that = this;
        // this.userService.getUserData(function () {
        //     that.isAdminRoleBilling = that.userService.userData['isBillingAdmin'];
        // });
        if (this.transitionsService.previousUrl.match(/\/(.*)\//)) {
            const prevUrl = this.transitionsService.previousUrl.match(/\/(.*)\//)[1];
            switch (prevUrl) {
                case 'billing-reports-details':
                    this.tabIndex = 1;
                    break;
                case 'activity-reports-details':
                    this.tabIndex = 2;
                    break;
                default:
                    this.tabIndex = 0;
                    break;
            }
        }
        else this.tabIndex = 0;
        if (this.transitionsService.isFromMerchantToBusinessReport) {
            this.tabIndex = 1;
            this.merchant = this.transitionsService.merchant;
        }

        this.transitionsService.currentRTLToggle.subscribe(() => {
            that.isRTLToggle = true;
            that.reloadMatTabGroup();
        });

        this.transitionsService.currentRTLToggle.subscribe((data) => {
            this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
        });

        this.transitionsService.setMerchantData({});
        this.dictionaryService.getDictionaries(function (convertedDTO) {
            that.reportsStatusFilter = convertedDTO['kycStatuses'];
            that.transactionTypeFilter = that.dictionaryService.dictionaries['transactionStatuses'];
            that.reportsActionTypeFilter = that.dictionaryService.dictionaries['operationCodes'];
            
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
        this.storageService.read('tableActivityReportsListFilter') ?
            this.tableActivityReportsListFilter = this.storageService.read('tableActivityReportsListFilter') :
            this.tableActivityReportsListFilter = {
            operationDate: {
                title: "Operation Date",
                checkbox: true,
            },
            merchantName: {
                title: "Merchant Name",
                checkbox: true,
            },
            operationDoneBy: {
                title: "User",
                checkbox: true,
            },
            operationDescription: {
                title: "Operation Description",
                checkbox: true,
            },
            additionalDetails: {
                title: "Additional Details",
                checkbox: true,
            },
            correlationId: {
                title: "Correlation ID",
                checkbox: true,
            }
        };
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

        this.initDrops();
    }

    ngOnDestroy() {
        this.storageService.remove('tableTransactionsReportsListFilter');
        this.storageService.remove('tableActivityReportsListFilter');
        this.requests.unsubscribeRequests();
        this.transitionsService.isFromMerchantToBusinessReport = false;
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

    public onColumnsChangeActivity() {
        this.storageService.write('tableActivityReportsListFilter', this.tableActivityReportsListFilter);
    }

    public onColumnsChangeTransactions() {
        this.storageService.write('tableTransactionsReportsListFilter', this.tableTransactionsReportsListFilter);
    }

    reloadMatTabGroup() {
        const that = this;
        setTimeout(function () {
            that.isRTLToggle = false;
        }, 100);
    }

    public onTabChange(event: MatTabChangeEvent) {
        this.toggleFilterSection = false;
        this.tabIndex = event['index'];
        this.page = 1;
        this.maxSize = 10;
        this.collectionSize = 0;
        this.pageSize = 10;
        switch (event['index']) {
            case 0:
                this.selectedReportsPeriod = 'daily';
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                // console.log('tab?');
        }
        this.pageChange();
    }

    private getTransactionPeriodList(prefix, requestUrl) {
        this.reportsService.getReportsTransactionList(
            prefix,
            requestUrl,
            (data) => {
                // console.log(data);
                this.reportsList = data.data;
                this.collectionSize = data.numberOfRecords;
            });
    }

    public getList(skip) {
        // console.log(this.tabIndex);
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
        switch (this.tabIndex) {
            case 0:
                requestUrl['filterGroup'] = this.filterGroup['transactionsReport'];
                this.getTransactionPeriodList(this.selectedReportsPeriod, requestUrl);
                break;
            case 1:
                requestUrl['date'] = this.filtersService.getUTCDate(this.tablePeriodFrom);
                this.reportsService.getReportsBillingList(
                    requestUrl,
                    (data) => {
                        // console.log(data);
                        this.reportsList = data.data;
                        this.collectionSize = data.numberOfRecords;
                    });
                break;
            case 2:
                requestUrl['filterGroup'] = this.filterGroup['activityReports'];
                this.reportsService.getReportsActivityList(
                    requestUrl,
                    (data) => {
                        // console.log(data);
                        this.reportsList = data.data;
                        this.collectionSize = data.numberOfRecords;
                    });
                break;
            case 3:
                // console.log('coming soon');
                break;
            default:
                this.tabIndex = null;
                // console.log('another tab?');
        }
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
        const today = new Date();
        const tmpDate = new Date();
        const lastDay = new Date(tmpDate.setDate(tmpDate.getDate() - 1));
        const lastTenDays = new Date(tmpDate.setDate(tmpDate.getDate() - 10));
        const lastMonth = new Date(tmpDate.setDate(tmpDate.getDate() - 30));
        const requestUrl = {
            merchantID: '',
            take: this.pageSize,
            skip: this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0
        };
        switch (this.tabIndex) {
            case 0:
                switch (this.selectedReportsPeriod) {
                    case 'daily':
                        requestUrl['dateFrom'] = this.filtersService.getUTCDate(this.filtersService.setCustomNgbDate(
                            lastDay.getUTCFullYear(),
                            lastDay.getUTCMonth() + 1,
                            lastDay.getUTCDate()));
                        requestUrl['dateTo'] = this.filtersService.getUTCDate(this.filtersService.setCustomNgbDate(
                            today.getUTCFullYear(),
                            today.getUTCMonth() + 1,
                            today.getUTCDate()));
                        this.reportsService.getReportsTransactionExcel(
                            'dailyExcel',
                            requestUrl,
                            (data) => {
                                // console.log(data);
                                window.open(data['downloadUrl']);
                            });
                        break;
                    case 'monthly':
                        requestUrl['dateFrom'] = this.filtersService.getUTCDate(this.filtersService.setCustomNgbDate(
                            lastMonth.getUTCFullYear(),
                            lastMonth.getUTCMonth() + 1,
                            lastMonth.getUTCDate()));
                        requestUrl['dateTo'] = this.filtersService.getUTCDate(this.filtersService.setCustomNgbDate(
                            today.getUTCFullYear(),
                            today.getUTCMonth() + 1,
                            today.getUTCDate()));
                        this.reportsService.getReportsTransactionExcel(
                            'monthlyExcel',
                            requestUrl,
                            (data) => {
                                // console.log(data);
                                window.open(data['downloadUrl']);
                            });
                        break;
                    case 'lastTenDays':
                        requestUrl['dateFrom'] = this.filtersService.getUTCDate(this.filtersService.setCustomNgbDate(
                            lastTenDays.getUTCFullYear(),
                            lastTenDays.getUTCMonth() + 1,
                            lastTenDays.getUTCDate()));
                        requestUrl['dateTo'] = this.filtersService.getUTCDate(this.filtersService.setCustomNgbDate(
                            today.getUTCFullYear(),
                            today.getUTCMonth() + 1,
                            today.getUTCDate()));
                        this.reportsService.getReportsTransactionExcel(
                            'lastTenDaysExcel',
                            requestUrl,
                            (data) => {
                                // console.log(data);
                                window.open(data['downloadUrl']);
                            });
                        break;

                }
                break;
            case 1:
                this.reportsService.getReportsBillingExcel(
                    requestUrl,
                    (data) => {
                        // console.log(data);
                        window.open(data['downloadUrl']);
                    });
                break;
            case 2:
                this.reportsService.getReportsTransactionList(
                    'lastTenDaysExcel',
                    requestUrl,
                    (data) => {
                        // console.log(data);
                        window.open(data['downloadUrl']);
                    });
                break;
            case 3:
                this.reportsService.getReportsTransactionList(
                    'lastTenDaysExcel',
                    requestUrl,
                    (data) => {
                        // console.log(data);
                        window.open(data['downloadUrl']);
                    });
                break;
            default:
                // console.log('tab?');
        }
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

    private setTenDaysPeriod(today, tmpDate) {
        const lastTenDays = new Date(tmpDate.setDate(tmpDate.getDate() - 10));
        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
            lastTenDays.getUTCFullYear(),
            lastTenDays.getUTCMonth() + 1,
            lastTenDays.getUTCDate());
        this.tablePeriodTo = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
    }

    public onPeriodFilterChange() {
        const today = new Date();
        const tmpDate = new Date();
        switch (this.selectedReportsPeriod) {
            case 'daily':
                this.setDailyPeriod(today);
                break;
            case 'monthly':
                this.setMonthlyPeriod(today, tmpDate);
                break;
            case 'lastTenDays':
                this.setTenDaysPeriod(today, tmpDate);
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
            default:
                this.tablePeriodFrom = undefined;
                this.tablePeriodTo = undefined;
        }
        // console.log('onPeriodFilterChange: ', this.selectedReportsPeriod);
        // console.log(this.tablePeriodFrom, this.tablePeriodTo);
        this.pageChange();
    }

    public onDateRangeChange() {
        this.selectedReportsPeriod = null;
        this.pageChange();
    }

    public addNewMerchant() {
        this.router.navigate(['/merchants', 'new']);
    }

    public acceptFilters() {
        this.storageService.write('reportsFilterGroup', this.filterGroup);
        this.page === 0 ? this.pageChange() : this.page = 0;
    }

    public reloadConfigSelect($event) {
    }

    public transitionToBillingDetails(data: Object) {
        this.router.navigate(['/billing-reports-details', data['billingReportID']]);
    }

    public transitionToActiveDetails(data: Object) {
        this.router.navigate(['/activity-reports-details', data['merchantHistoryID']]);
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
