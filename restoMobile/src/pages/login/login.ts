import { Component, Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../services/auth.service';
import { User } from '../shared/models/user';
//import {ApiEndpointService} from '../services/api-endpoint.service';
import { Page2 } from '../page2/page2';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
    user: User;
    errorMessage: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthService) {
    //this.user = new User('', '', '', '', '');
    //this.errorMessage = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
//      this.authService.authenticateUser(this.user)
//      .subscribe(generalResponse =>
//          this.navCtrl.push(Page1)
//        , error => this.errorMessage = error);
  }

  onSubmit() {
      console.log('LoginPage submitting');
//      this.navCtrl.push(Page2);

     this.authService.authenticateUser(this.user)
       .subscribe(generalResponse =>
           this.navCtrl.push(Page2)
         , error => this.errorMessage = error);
  }
}
