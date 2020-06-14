import {Component, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {DashboardApiService} from "../../services/api/dashboard-api.service";
import {DatePipe} from "@angular/common";
import {TransactionApiService} from "../../services/api/transaction-api.service";
import {RequestsService} from "../../services/http-interceptors/requests.service";

export interface dashboardInfoInterface {
    generalBalanse: number;
    weeklyAmount: number;
    commission: number;
    lineChartData: Array<any>;
    lineChartLabels: Array<any>;
    dataTable: any;
};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()],
})

export class DashboardComponent implements OnInit, OnDestroy {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public generalBalanseImg: string;
    public weeklyAmountImg: string;
    public generalBalanceTitle: string;
    public weeklyAmountTitle: string;
    public commissionTitle: string;

    public chartLabels: Array<string> = [];
    public chartData: Array<number> = [];

    public transactionsList: Array<Object> = [];

    public dataTable: [{
        date: any,
        transactionID: any,
        merchant: any,
        paymentGateway: any,
        status: any,
        currency: any,
        amount: any
    }];

    public dashboardInfo: dashboardInfoInterface;

    constructor(private dashboardService: DashboardApiService,
                private requests: RequestsService,
                public transactionsService: TransactionApiService,
                private datePipe: DatePipe) {
        this.generalBalanseImg = './assets/images/dashboard/general_balance_icon.svg';
        this.weeklyAmountImg = './assets/images/dashboard/Weekly Amount_icon.svg';
        this.generalBalanceTitle = 'General Balance';
        this.weeklyAmountTitle = 'Last ten days Amount';
        this.commissionTitle = 'Commission';
    }

    ngOnInit() {
        const that = this;
        this.dashboardService.getDashboardData(function (data) {
            that.dashboardInfo = data;
            if (data) {
                for (let i = 0; i < that.dashboardInfo['transactionsChart'].length; i++) {
                    that.chartLabels.push(that.datePipe.transform(
                        that.dashboardInfo['transactionsChart'][i]['date'], 'dd/MM/yyyy'));
                    that.chartData.push(that.dashboardInfo['transactionsChart'][i]['numberOfTransactions']);
                }
            }
        });
        this.getTransactionsList();
    }

    private getTransactionsList() {
        const that = this;
        // that.transactionsList = [];
        this.transactionsService.getTransactionsList(
            {
                skip: 0,
                step: 5,
                take: 5
            },
            function (data) {
                that.transactionsList = data.data;
            }, (error) => {
                // console.log(error);
            });
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    public chartClicked(event) {
        // console.log(event);
    }
}
