import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login';
import { RestaurantListPage } from '../pages/restaurant-list/restaurant-list';
import { AuthService } from '../pages/services/auth.service';
import { RestaurantService } from '../pages/services/restaurant.service';
import { ApiEndpointService } from '../pages/services/api-endpoint.service';
import { AuthHttpService } from '../pages/services/auth-http.services';
import {TranslateModule, TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';
import { HttpModule, Http } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    RestaurantListPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
      TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/languages', '.json'),
            deps: [Http]
        })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    RestaurantListPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, AuthService, ApiEndpointService, RestaurantService, AuthHttpService, TranslateService]
})
export class AppModule {}
