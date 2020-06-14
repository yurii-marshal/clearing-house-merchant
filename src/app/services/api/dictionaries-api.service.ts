import {Injectable} from "@angular/core";
import {RequestsService} from "../http-interceptors/requests.service";

@Injectable()
export class DictionariesService {
    public dictionaries: Object = {};
    public convertedDTO: Object = {};

    constructor(private httpService: RequestsService) {
    }

    public getDictionaries(response) {
        const that = this;
        this.httpService.get(
            `/dictionaries`,
            {},
            (data) => {
                that.dictionaries = data;
                that.convertedDTO = {};
                for (let prop in data) {
                    if (!data.hasOwnProperty(prop)) continue;
                    that.convertedDTO[prop] = {};
                    for (let i = 0; i < data[prop].length; i++) {
                        that.convertedDTO[prop][data[prop][i]['code']] = {
                            title: data[prop][i]['description'],
                            checkbox: false
                        };
                    }
                }
                if(response) response(that.convertedDTO);
            },
            () => (null),
            () => (null));
    }
}