import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../app-settings";

@Injectable()
export class ValuesApiService {
    private requestPrefix: string;
    private response: string;

    constructor(private http: HttpClient) {
        this.requestPrefix = AppSettings.BASE_URL + '/Values';
    }

    public getValues() {
        return this.http.get(this.requestPrefix, AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
    public createValue(data: string) {
        return this.http.put(this.requestPrefix, data, AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
    public getValueByID(valueId: number) {
        return this.http.get(this.requestPrefix + `${valueId}`, AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
    public updateValueByID(valueId: number) {
        return this.http.post(this.requestPrefix, valueId, AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
    public removeValueByID(valueId: number) {
        return this.http.delete(this.requestPrefix + `${valueId}`, AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
}
