import {Injectable} from "@angular/core";
import {RequestsService} from "../http-interceptors/requests.service";

@Injectable()
export class UserApiService {
    public userData: Object;

    constructor(public httpService: RequestsService) {
    }

    public getUserData(response) {
        const that = this;
        this.httpService.get(
            `/profile`,
            {},
            (data) => {
                that.userData = data;
                response(data);
            },
            () => (null), () => (null));
    }
}