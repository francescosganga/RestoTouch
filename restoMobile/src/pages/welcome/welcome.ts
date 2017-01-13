import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Page2 } from '../page2/page2'
 
//Reminder import NavParams, Restaurant, Language

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
	languages: string[]; //placeholder
	selectedLanguage: string;
	//selectedRestaurant: Restaurant;

  constructor(public navCtrl: NavController) {
    //this.selectedRestaurant = navParams.get('restaurant');
    this.languages = ['en', 'fr', 'es', 'jp']; //placeholder
  }

  continueTapped(event) {
    // Will push to virtual menu page
    this.navCtrl.push(Page2, {
    });
  }
  //Selected Languages pushed as a parameter or set globally in another component/service?

}