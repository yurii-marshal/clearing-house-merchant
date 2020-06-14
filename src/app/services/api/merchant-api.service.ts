import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../app-settings";
import {Observable} from "rxjs/Observable";
import {map} from "rxjs/operators";

export type MerchantType = {
    merchantName: string,
    merchantEmail: string,
    businessDetails: {
        businessName: string,
        businessId: string,
        businessArea: string,
        businessPhone: string
    },
    personalDetails: {
        firstName: string,
        lastName: string,
        gender: string,
        cellPhone: string,
        nationalIdNumber: string,
        nationalIdNumberDate: string,
        birthDate: string
    },
    bankAccount: {
        bankNumber: string,
        branchNumber: string,
        bankAccountNumber: string
    },
    creditCardAccount: {
        cardNumber: string,
        cardExpiration: string,
        cardOwnerName: string,
        cardOwnerNationalId: string
    }
};

@Injectable()
export class MerchantApiService {
    private requestPrefix: string;
    private response: string;

    constructor(private http: HttpClient) {
        this.requestPrefix = AppSettings.BASE_URL + '/merchant';
    }

    // public getMerchantProfileDetails() {
    //     return this.http.get(this.requestPrefix, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }

    public getMerchantProfileDetails(): Observable<any> {
        return this.http.get(this.requestPrefix).pipe(
            map((data: any) => {
                return data;
            })
        );
    }
    public updateMerchantProfileDetails(data: MerchantType) {
        return this.http.put(this.requestPrefix, data, AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
}
