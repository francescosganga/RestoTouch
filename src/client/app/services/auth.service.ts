// Observable Version
import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';

import {User} from '../shared/models/user';
import {Observable}     from 'rxjs/Observable';
import {GeneralResponse}  from '../shared/general.response';

@Injectable()
export class AuthService  {
  public loggedInUser: User;

  private url = 'http://localhost:10010/login';

  constructor(private http: Http) {
    console.log('hhdh');
    var data = localStorage.getItem('user');
    if (data !== null) {
      this.loggedInUser = JSON.parse(data);
    }
  }

  isLoggedIn(): Boolean {
    return this.loggedInUser !== null;
  }

  authenticateUser(user: User): Observable<GeneralResponse> {
    let body = JSON.stringify(user);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  registerUser(user: User): Observable<GeneralResponse> {
    let body = JSON.stringify(user);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    localStorage.setItem('authToken', body.accessToken);
    localStorage.setItem('user', JSON.stringify(body.user));
    this.loggedInUser = new User(body.user.firstName, body.user.lastName, body.user.email);
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
