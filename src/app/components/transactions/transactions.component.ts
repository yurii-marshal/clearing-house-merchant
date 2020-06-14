import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {TransactionApiService} from "../../services/api/transaction-api.service";
import {FiltersService} from "../../services/filters.service";
import {DictionariesService} from "../../services/api/dictionaries-api.service";
import {Router} from "@angular/router";
import {RequestsService} from "../../services/http-interceptors/requests.service";
import {TransitionsService} from "../../services/transitions.service";
import {LocalstorageService} from "../../services/localstorage.service";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {CustomDatepickerI18n, I18n} from "../../services/ngb-datepicker-i18n.service";
import {ToastrService} from "ngx-toastr";

export interface orderBy {
    date: string;
    transactionID: string;
    customerName: string;
    paymentGateway: string;
    status: string;
    currency: string;
    amount: string;
}

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class TransactionsComponent implements OnInit, OnDestroy {
    public transactionsList: any;
    public idUserForTransactions: number = null;
    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    public filterGroup: Object;

    selectedTransactionsPeriod: any;
    transactionsPeriodLabels: any;
    transactionsPeriodFilter: any;
    transactionsTableFilters: Object;
    currentOrderBy: Object;

    isStandardMode: boolean;

    isColumnsFilterEmpty = true;
    isDataFilterEmpty = true;

    placementPosition: string;
    datePlacement: string;

    public toggleFilterSection: boolean = false;

    public transactionTypeFilter: any;

    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    constructor(config: NgbDropdownConfig,
                public transitionsService: TransitionsService,
                private storageService: LocalstorageService,
                public translate: TranslateService,
                public requests: RequestsService,
                public transactionsApi: TransactionApiService,
                public dictionaryService: DictionariesService,
                public filtersService: FiltersService,
                public router: Router,
                private toastr: ToastrService,
                private _eref: ElementRef) {
        config.placement = 'bottom-right';
        config.autoClose = "outside";
        this.selectConfig = config;
        // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        // console.log(event.lang);
        //     this.isStandardMode = event.lang !== 'he';
        //     this.transitionsService.currentLang = event.lang;
        //     this.initDrops();
        // });
        if (window.innerWidth >= 768) {
            this.placementPosition =
                this.datePlacement =
                    this.storageService.read('lang') === 'he' ? 'bottom-right' : 'bottom-left';
        }
        else {
            this.datePlacement = this.placementPosition = 'bottom-left';
        }
    }

    ngOnInit() {
        const that = this;
        this.initFilterGroup();
        this.storageService.read('transactionsTableFilters') ?
            this.transactionsTableFilters = this.storageService.read('transactionsTableFilters') :
            this.transactionsTableFilters = {
                transactionDate: {
                    title: "Date",
                    checkbox: true,
                },
                transactionID: {
                    title: "Transaction ID",
                    checkbox: true,
                },
                transactionType: {
                    title: "Transaction Type",
                    checkbox: true,
                },
                transactionDescription: {
                    title: "Transaction Description",
                    checkbox: true,
                },
                customerName: {
                    title: "Customer Name",
                    checkbox: true,
                },
                creditCardVendor: {
                    title: "Credit Card Vendor",
                    checkbox: true,
                },
                paymentGateway: {
                    title: "Payment Gateway",
                    checkbox: true,
                },
                status: {
                    title: "Status",
                    checkbox: true,
                },
                currency: {
                    title: "Currency",
                    checkbox: true,
                },
                initialAmount: {
                    title: "Initial Amount",
                    checkbox: true,
                },
                totalAmount: {
                    title: "Total Amount",
                    checkbox: true,
                }
            };
        if (this.storageService.read('transactionsFilterGroup') != null) {
            this.filterGroup = this.storageService.read('transactionsFilterGroup');
            this.toggleFilterSection = true;
        }
        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );
        this.idUserForTransactions = this.transitionsService.idUserForTransactions;
        this.getList(0);
        this.dictionaryService.getDictionaries(function () {
            that.transactionTypeFilter = that.dictionaryService.dictionaries['transactionStatuses'];
        });
        this.transactionsPeriodLabels = ['Today', 'Yesterday', 'Last Week', 'Last Month'];
        this.transactionsPeriodFilter = [
            {
                code: 'today',
                description: ''
            },
            {
                code: 'yesterday',
                description: ''
            },
            {
                code: 'lastWeek',
                description: ''
            },
            {
                code: 'lastMonth',
                description: ''
            }
        ];
        this.initDrops();

        // this.transitionsService.currentRTLToggle.subscribe((data) => {
        //     if (window.innerWidth >= 768) {
        //         this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
        //     }
        // });

        this.checkDataFilterEmpty();
        this.checkColumnsFilterEmpty();
    }

    ngOnDestroy() {
        this.storageService.remove('transactionsFilterGroup');
        this.storageService.remove('transactionsTableFilters');
        this.transitionsService.setUserForTransaction(null);
        this.requests.unsubscribeRequests();
    }

    private checkDataFilterEmpty() {
        this.isDataFilterEmpty = true;
        for (let item in this.filterGroup) {
            if (!!this.filterGroup[item]) {
                this.isDataFilterEmpty = false;
                break;
            }
        }
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.transactionsTableFilters) {
            if (this.transactionsTableFilters[item]['checkbox'] === false) {
                this.isColumnsFilterEmpty = false;
                break;
            }
        }
    }

    public initFilterGroup() {
        this.filterGroup = {
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
        };
        this.acceptFilters();
    }

    private initDrops() {
        this.transactionsPeriodFilter.forEach((item, index) => {
            let tmpFilter = this.transactionsPeriodFilter.slice();
            this.translate.get(this.transactionsPeriodLabels[index])
                .subscribe(res => {
                    tmpFilter[index].description = res;
                    this.transactionsPeriodFilter = tmpFilter.slice();
                });
        });
    }

    public onColumnsChange() {
        this.checkColumnsFilterEmpty();
        this.storageService.write('transactionsTableFilters', this.transactionsTableFilters);
    }

    public transitionToTransaction(data: Object) {
        this.router.navigate(['/transactions', data['transactionID']]);
    }

    public getList(skip) {
        let that = this;
        this.transactionsApi.getTransactionsList(
            {
                take: this.pageSize,
                skip: skip,
                order: this.currentOrderBy,
                dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
                dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
                filterGroup: this.filterGroup
            },
            (data) => {
                // console.log(data);
                that.transactionsList = data.data;
                that.collectionSize = data.numberOfRecords;
            }, (error) => {
                // console.log(error);
                // this.toastr.error(error.status + ' ' + error.statusText,
                //     'System Error', {
                //         disableTimeOut: true,
                //         closeButton: true
                //     });
            });
    }

    public pageChange() {
        this.getList(this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0);
    }

    public refreshPage() {
        this.transactionsList = [];
        this.collectionSize = 0;
        this.page = 1;
        this.pageChange();
    }

    public onPeriodFilterChange() {
        const today = new Date();
        const tmpDate = new Date();
        switch (this.selectedTransactionsPeriod) {
            case 'today':
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
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
                // const lastMonth = new Date(tmpDate.setDate(tmpDate.getDate() - 30));
                const date = new Date(),
                    y = date.getFullYear(),
                    m = date.getUTCMonth(),
                    firstDay = new Date(y, m - 1, 1),
                    lastDay = new Date(y, m, 0);
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    firstDay.getFullYear(),
                    firstDay.getMonth() + 1,
                    firstDay.getDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    lastDay.getFullYear(),
                    lastDay.getMonth() + 1,
                    lastDay.getDate());
                break;
            default:
                this.tablePeriodFrom = undefined;
                this.tablePeriodTo = undefined;
        }
        // console.log('onPeriodFilterChange: ', this.selectedTransactionsPeriod);
        // console.log(this.tablePeriodFrom, this.tablePeriodTo);
        this.pageChange();
    }

    public onDateRangeChange() {
        // console.log('onDateRangeChange: ', this.tablePeriodFrom, this.tablePeriodTo);
        this.selectedTransactionsPeriod = null;
        this.pageChange();
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

    public acceptFilters() {
        this.storageService.write('transactionsFilterGroup', this.filterGroup);
        this.page === 1 ? this.pageChange() : this.page = 1;
        // this.toggleFilterSection = false;
        this.checkDataFilterEmpty();
    }

    public reloadConfigSelect($event) {
        // console.log($event);
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
