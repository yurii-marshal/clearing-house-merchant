import {Injectable} from "@angular/core";
import {RequestsService} from "../http-interceptors/requests.service";

@Injectable()
export class DashboardApiService {
    constructor(private httpService: RequestsService) {
    }

    public getDashboardData(response) {
        this.httpService.get(
            `/dashboard`,
            {},
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }
}