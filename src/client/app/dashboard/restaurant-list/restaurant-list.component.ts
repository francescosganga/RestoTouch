import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {Restaurant} from '../../shared/models/restaurant';
import {Language} from '../../shared/models/language';
import {RestaurantService} from '../restaurant/restaurant.service';
import {TranslateService} from 'ng2-translate';
import {TranslationSelectComponent} from '../../shared/translation-select/translation-select.component';
@Component({
  moduleId: module.id,
  selector: 'restaurant-list-cmp',
  templateUrl: 'restaurant-list.component.html',
  providers: [RestaurantService]
})

export class RestaurantListComponent implements OnInit {
  numOfRestaurants: number;
  restaurants: Restaurant[];


  @ViewChild(TranslationSelectComponent)
  private translationSelectComponent: TranslationSelectComponent;

  constructor(private restaurantListService: RestaurantService,
              private router: Router,
              private translate: TranslateService,) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
  }

  getRestaurants(): void {
    this.restaurantListService.getRestaurants().subscribe(
      restaurants => {
        restaurants.forEach(restaurant => {
          restaurant.selectedTranslation = restaurant.translations.find(translation => translation.languageCode === this.translationSelectComponent.selectedLanguage.languageCode);
        });
        this.restaurants = restaurants;
        this.numOfRestaurants = this.restaurants.length;
      },
      error => {
        console.log(error);
      }
    );
  }

  onSelectLanguage(language: Language) {
    this.restaurants.forEach(restaurant => {
      restaurant.selectedTranslation = restaurant.translations.find(translation => translation.languageCode === language.languageCode);
    });
  }

  ngOnInit(): void {
    this.getRestaurants();
  }

  add(): void {
    this.router.navigate(['/dashboard/restaurant']);
  }

  modify(restaurant: Restaurant): void {
    this.router.navigate(['/dashboard/restaurant', restaurant.id]);
  }
}
