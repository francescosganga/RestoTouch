import { Injectable } from '@angular/core';
import { Category } from '../shared/models/category';
import { GeneralResponse }  from '../shared/general.response';
import { Response, Headers, RequestOptions } from '@angular/http';
import { AuthHttpService } from '../services/auth-http.services';
import { Observable } from 'rxjs/Observable';
import { ApiEndpointService } from '../services/api-endpoint.service';

@Injectable()
export class CategoryService {
    private url = '/category';

    constructor (private http: AuthHttpService, private api: ApiEndpointService) {}

    getCategory (id: number): Observable<Category> {
        return this.http.get(this.api.getEndpoint() + this.url + '/' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCategories (): Observable<Category[]> {
        return this.http.get(this.api.getEndpoint() + this.url)
            .map((response) => this.extractData(response).categories)
            .catch(this.handleError);
    }

    addCategory (category: Category): Observable<GeneralResponse> {
        let body = JSON.stringify(category);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.api.getEndpoint() + this.url, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateCategory (category: Category): Observable<GeneralResponse> {
        let body = JSON.stringify(category);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(this.api.getEndpoint() + this.url + '/' + category.id, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteCategory (category: Category): Observable<Category> {
        return this.http.delete(this.api.getEndpoint() + this.url + '/' + category.id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
