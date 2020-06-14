import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../app-settings";

@Injectable()
export class StatusApiService {
    private requestPrefix: string;
    private response: string;

    constructor(private http: HttpClient) {
        this.requestPrefix = AppSettings.BASE_URL + '/transactionStatus';
    }

    public getStatusesList() {
        return this.http.get(this.requestPrefix, AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
}
