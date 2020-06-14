import {RequestsService} from "../http-interceptors/requests.service";
import {Injectable} from "@angular/core";

@Injectable()
export class ReportsApiService {
    constructor(private httpService: RequestsService) {
    }

    public getReportsTransactionList(prefix, requestUrl, response) {
        this.httpService.get(
            `/transactionsReport/${prefix}`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsTransactionExcel(prefix, requestUrl, response) {
        this.httpService.get(
            `/transactionsReport/${prefix}`,
            requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsActivityList(requestUrl, response) {
        this.httpService.get(
            `/businessActivity`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsBillingList(requestUrl, response) {
        this.httpService.get(
            `/billingReport`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsBillingExcel(requestUrl, response) {
        this.httpService.get(
            `/billingReport/excel`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportBillingDetails(merchantId, requestUrl, response) {
        this.httpService.get(
            `/billingReport/${merchantId}/transactions`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportActivityDetails(merchantHistoryId, response) {
        this.httpService.get(
            `/businessActivity/${merchantHistoryId}`,
            {},
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportBillingDetailsExcel(requestUrl, response) {
        this.httpService.get(
            `/billingReport/bankExchange`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }
}