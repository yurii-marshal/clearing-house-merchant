import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../app-settings";

export type DocumentType = {
    documentID: number,
    documentName: string,
    merchantID: number,
    status: string,
    documentDescription: string
};

@Injectable()
export class DocumentApiService {
    private requestPrefix: string;
    private response: string;

    constructor(private http: HttpClient) {
        this.requestPrefix = AppSettings.BASE_URL + '/document';
    }

    public getDocumentsList() {
        return this.http.get(this.requestPrefix, AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
    public updateDocumentDetails(data: DocumentType) {
        return this.http.put(this.requestPrefix, data, AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
    public uploadNewFile(data: Object) {
        return this.http.post(this.requestPrefix, data, AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
    public removeDocument() {
        return this.http.delete(this.requestPrefix, AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
}
