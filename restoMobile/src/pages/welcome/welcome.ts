import { Component, EventEmitter, Output } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Page2 } from '../page2/page2'

import { Language } from '../shared/models/language';
import { LanguageService } from '../services/language.service';
import { Restaurant } from '../shared/models/restaurant';
import {TranslateService} from 'ng2-translate';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  
	languages: Array<Language> = [];
  supportedLanguages: Array<Language> = [];
	selectedLanguage: Language = new Language('','selectedLanguage','',0);
	selectedRestaurant: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
  			      private languageService: LanguageService,
              private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    this.selectedRestaurant = navParams.get('item');
    this.languages = languageService.languages();
    for (let availLang of this.selectedRestaurant.translations){
      let lang = this.languages.find(language => language.languageCode === availLang.languageCode);
      this.supportedLanguages.push(lang);
    }
  }


  continueTapped(event) {
    // Will push to virtual menu page
    /* need to pass selectedLanguage as parameter to menu */
    this.navCtrl.push(Page2, {
    });
  }

  selectLanguage() {
    let trans = this.selectedRestaurant.translations.find(translation => 
      translation.languageCode === this.selectedLanguage.languageCode);
    this.selectedRestaurant.selectedTranslation = trans;
    //to set the current language
    this.translate.use(this.selectedLanguage.languageCode);
  }
}