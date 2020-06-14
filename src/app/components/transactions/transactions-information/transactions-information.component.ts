import {Component, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from "../../../router.animations";
import {ActivatedRoute, Router} from "@angular/router";
import {TransactionApiService} from "../../../services/api/transaction-api.service";
import {RequestsService} from "../../../services/http-interceptors/requests.service";

@Component({
  selector: 'app-transactions-information',
  templateUrl: './transactions-information.component.html',
  styleUrls: ['./transactions-information.component.scss'],
  animations: [routerTransition()]
})
export class TransactionsInformationComponent implements OnInit, OnDestroy {
    params: any;
    public transaction: Object = {
        additionalPaymentsAmount: null,
        basicCommission: null,
        concurrencyToken: "",
        currency: "",
        history: [],
        initialPaymentAmount: null,
        installmentCommission: null,
        merchant: {
            activityStartDate: "",
            businessArea: null,
            businessId: "",
            kycApprovalStatus: "",
            merchantID: null,
            merchantName: "",
            merchantReference: "",
            phone: "",
            riskRate: 5
        },
        merchantAmmount: null,
        paymentGateway: null,
        paymentGatewayAdditionalDetails: {
            shvaShovarNumber: null,
            shvaShovarData: null
        },
        paymentGatewayTransactionDetails: {
            consumerEmail: "",
            consumerPhone: "",
            creditCardVendor: "",
            dealDescription: "",
            dealReference: "",
            merchantReference: "",
            terminalReference: "",
            transactionDate: ""
        },
        payments: null,
        status: "",
        totalAmount: null,
        totalCommission: null,
        transactionDate: "",
        transactionID: null
    };

    constructor(currentRouter: ActivatedRoute,
                private requests: RequestsService,
                public transactionsApi: TransactionApiService,
                public router: Router) {
        const that = this;
        currentRouter.params.subscribe(params => {
            this.params = params;
            if (!params['id']) {
                this.router.navigate(['/transactions']);
            }
            else {
                that.getData();
            }
        });
    }

    public getData() {
        const that = this;
        this.transactionsApi.getTransactionByID(this.params['id'], (data) => {
            // console.log('getTransactionByID', data);
            that.transaction = data;
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }
}
