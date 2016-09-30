import { Injectable } from '@angular/core';

//import { Restaurant, OpeningHour } from './restaurant';
import { Restaurant } from './restaurant';

import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RestaurantListService {
  private url = 'http://localhost:10010/restaurant';

  /*getRestaurants(): Promise<Restaurant[]> {
    return Promise.resolve(RESTAURANTS);
  }*/


  constructor (private http: Http) {}

  getRestaurants (): Observable<Restaurant[]> {
    return this.http.get(this.url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.restaurants || { };
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

/*const RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: 'McDonald',
    description: 'Fast food restaurant',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 2,
    name: 'Yuan Vegetarien',
    description: 'Asian vegan restaurant',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 3,
    name: 'Copper Branch',
    description: 'Vegan fast food restaurant',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 4,
    name: 'Burger King',
    description: 'Fast food restaurant',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 5,
    name: 'St-Hubert',
    description: 'BBQ restaurant',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 6,
    name: 'Cage Aux Sport',
    description: 'Sports Restaurant',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 7,
    name: 'Paccini',
    description: 'Italian Restaurant',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 8,
    name: 'Villa Massimo',
    description: 'Italian Restaurant',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 9,
    name: 'Sushi Shop',
    description: 'Sushi Restaurant',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 10,
    name: 'Subway',
    description: 'Sandwich fast food Restaurant',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 11,
    name: 'KFC',
    description: 'Chicken fast food Restaurant',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 12,
    name: 'Restaurant 1',
    description: 'Restaurant Description',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 13,
    name: 'Restaurant 2',
    description: 'Restaurant Description',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 14,
    name: 'Restaurant 3',
    description: 'Restaurant Description',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 15,
    name: 'Restaurant 4',
    description: 'Restaurant Description',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }, {
    id: 16,
    name: 'Restaurant 5',
    description: 'Restaurant Description',
    address: '7141 Rue Sherbrooke O, Montréal, QC H4B 1R6',
    openingHours: [
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'},
      {open: '12:00 pm', close: '12:00pm'}
    ]
  }
];*/
