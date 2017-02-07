import { Component, Inject, ViewChild } from '@angular/core';
import { Nav, NavController, MenuController, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AuthService } from '../pages/services/auth.service';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { MenuListPage } from '../pages/menu-list/menu-list';
import { WelcomePage } from '../pages/welcome/welcome';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { RestaurantListPage } from '../pages/restaurant-list/restaurant-list';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('content') navController: NavController;

  rootPage: any = HomePage;
  startPage: any = LoginPage;
  restoListPage: any = RestaurantListPage;
  welcomePage: any = Page2;

  pages: Array<{title: string, component: any}>;
  usePage: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public authService: AuthService) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.pages = [

//      { title: 'Page One', component: Page1 },
//      { title: 'Page Two', component: Page2 },
//      { title: 'Welcome Page', component: WelcomePage},
//      { title: 'Settings', component: SettingsPage},
//      { title: 'Restaurant List', component: RestaurantListPage },
      { title: 'Login', component: LoginPage }
//      { title: 'Home', component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.authService.setMainNavController(this.navController);
//        this.nav.setRoot(LoginPage);
        //this.loadedResto = navParams.get('loadedResto');

    });

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
