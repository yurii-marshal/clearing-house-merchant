import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../app-settings";
import {RequestsService} from "../http-interceptors/requests.service";

@Injectable()
export class TransactionApiService {
    constructor(public httpService: RequestsService) {
        // this.requestPrefix = AppSettings.BASE_URL + '/transaction';
    }

    // public getTransactionByID(transactionID: number) {
    //     return this.http.get(this.requestPrefix + `${transactionID}`, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public getTransactionByID(transactionID, response) {
        this.httpService.get(
            `/transaction/${transactionID}`,
            {},
            (data) => {response(data);},
            () => (null),
            () => (null));
    }

    // public getTransactionsList() {
    //     return this.http.get(this.requestPrefix, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    // public getTransactionsList(): Observable<any> {
    //     return this.http.get(this.requestPrefix).pipe(
    //         map((data: any) => {
    //             return data;
    //         })
    //     );
    // }
    public getTransactionsList(requestUrl, response, errorCallback) {
        this.httpService.get(
            `/transaction`, requestUrl,
            (data) => {response(data);},
            () => (null),
            (error) => (errorCallback(error)));
    }
}
