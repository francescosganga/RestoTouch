import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from "ionic-native";
import { Category } from '../shared/models/category';
import { Item } from '../shared/models/items';
import { Size } from '../shared/models/size';
import { IngredientGroup } from '../shared/models/ingredient-group';
import { OrderableCategory, OrderableItem, OrderableSize } from './orderable-category';
import { Order } from '../shared/models/order';
import { SelectedIngredients } from '../shared/models/selected-ingredients';
import { Menu } from '../shared/models/menu';
import { CategoryService } from '../services/category.service';
import { ItemService } from '../services/item.service';
import { MenuService } from '../services/menu.service';
import { FoodListPage } from '../food-list/food-list';
import { IngredientGroupPage } from '../ingredient-group/ingredient-group';
import { OrderService } from '../services/order.service';
import { WelcomePage } from '../welcome/welcome';
import { Platform } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  selectedMenu: any;
  selectedLanguage: any;
  selectedRestaurant: any;
  menu: Menu;
  categories: Array<OrderableCategory>;
  total: string;

  currentOrder = new Order([], 0, 'notPaidNotComplete', '');
  showAllCategories: boolean;
  currentCategory: Category;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private categoryService: CategoryService,
              private orderService: OrderService,
              private itemService: ItemService,
              private menuService: MenuService,
              private platform: Platform,
              private alertCtrl: AlertController,
              private translate: TranslateService) {

    this.selectedMenu = navParams.get('menu');
    this.selectedLanguage = navParams.get('language');
    this.selectedRestaurant = navParams.get('restaurant');
    this.selectedMenu.selectedTranslation = this.selectedMenu.translations.find(translation => translation.languageCode == this.selectedLanguage.languageCode);
    this.categories = [];
    this.total = "0.00";
    this.showAllCategories = true;

    this.getMenu(this.selectedMenu.id);
    // if order notification flag is set "ta" i.e table number, set notifyOrderDetail
    if (this.selectedRestaurant.orderNotiFlag=="ta")
      this.currentOrder.notifyOrderDetail = "Table: "+this.orderService.notifyOrderDetail;
  }

  isItemDisabled(targetItem, category): boolean {
    for (let item of this.menu.disabledCategoryItems) {
      if (item.itemId === targetItem.id && item.categoryId === category.id) {
        return true;
      }
    }
    return false;
  }

  getMenu(id: number): void {
    this.menuService.getMenu(id).subscribe(
      menu => {
        this.menu = menu;
        this.menu.selectedTranslation = this.menu.translations.find(translation => translation.languageCode == this.selectedLanguage.languageCode);
        this.menu.categories.forEach(category => {
          category.selectedTranslation = category.translations.find(translation => translation.languageCode == this.selectedLanguage.languageCode);
          var item: Item;
          for (var i = 0; i < category.items.length; i++) {
            item = category.items[i];
            if (this.isItemDisabled(item, category)) {
              category.items.splice(i--, 1);
            } else {
              item.selectedTranslation = item.translations.find(translation => translation.languageCode == this.selectedLanguage.languageCode);
              var size: Size;
              for (var j = 0; j < item.sizes.length; j++) {
                size = item.sizes[j];
                size.selectedTranslation = size.translations.find(translation => translation.languageCode == this.selectedLanguage.languageCode);
              }

              var group: IngredientGroup;
              for (var j = 0; j < item.ingredientGroups.length; j++) {
                group = item.ingredientGroups[j];
                group.selectedTranslation = group.translations.find(translation => translation.languageCode == this.selectedLanguage.languageCode);
              }
            }
          }
        });

        this.initOrderableCategories();
      },
      error => {
        console.log(error);
      }
    );
  }

  initOrderableCategories(): void {
    var self = this;
    let orderableCategory: OrderableCategory;
    let orderableItem: OrderableItem;
    let orderableSize: OrderableSize;
    this.menu.categories.forEach(category => {
      orderableCategory = new OrderableCategory(category, []);
      category.items.forEach(item => {
        orderableItem = new OrderableItem(item, []);
        item.sizes.forEach(size => {
          orderableSize = new OrderableSize(size, 0);
          orderableItem.sizes.push(orderableSize);
        });
        orderableCategory.items.push(orderableItem);
        item.ingredientGroups.sort(compareIngredientGroup);
      });
      self.categories.push(orderableCategory);
    });
  }

  addOrder(orderableCategory: OrderableCategory, orderableItem: OrderableItem, orderableSize: OrderableSize): void {
    if (orderableItem.item.ingredientGroups.length > 0) {
      this.addComplexOrder(orderableItem, orderableSize);
    } else {
      this.addSimpleOrder(orderableItem, orderableSize);
    }
  }

  removeOrder(orderableCategory: OrderableCategory, orderableItem: OrderableItem, orderableSize: OrderableSize): void {
    orderableSize.count = orderableSize.count > 0 ? orderableSize.count - 1 : 0;

    this.currentOrder.removeOrder(orderableItem.item, orderableSize.size, null);
  }

  addSimpleOrder(orderableItem: OrderableItem, orderableSize: OrderableSize): void {
    orderableSize.count++;

    this.currentOrder.addOrder(orderableItem.item, orderableSize.size, null, 0);
  }

  addComplexOrder(orderableItem: OrderableItem, orderableSize: OrderableSize): void {
    var self = this;
    var getComplexOrder = function(selectedIngredients: SelectedIngredients, price: number) {
      return new Promise((resolve, reject) => {
        orderableSize.count++;

        self.currentOrder.addOrder(orderableItem.item, orderableSize.size, selectedIngredients, price);

        resolve();
      });
    };

    this.navCtrl.push(IngredientGroupPage, {
      item: orderableItem.item,
      ingredientGroupIndex: 0,
      language: this.selectedLanguage,
      callback: getComplexOrder,
      ingredients: new SelectedIngredients([]),
      modify: false,
      total: 0
    }, {
      animate: true,
      animation: "md-transition",
      direction: "forward"
    });
  }

  orderList(): void {
    var self = this;
    var orderListCallback = function (order: Order, removeList: Array<any>) {
      return new Promise((resolve, reject) => {
        self.currentOrder = order

        let orderableSize: OrderableSize;
        self.categories.forEach(orderableCategory => {
          orderableCategory.items.forEach(orderableItem => {
            removeList.forEach(removedItem => {
              if (removedItem.item.id === orderableItem.item.id) {
                orderableItem.sizes.forEach(orderableSize => {
                  if (orderableSize.size.id === removedItem.size.id) {
                    orderableSize.count--;
                  }
                });
              }
            });
          });
        });

        resolve();
      });
    }

    this.navCtrl.push(FoodListPage, {
      order: this.currentOrder,
      language: this.selectedLanguage,
      callback: orderListCallback
    }, {
      animate: true,
      animation: "md-transition",
      direction: "forward"
    });
  }

  order(): void {
    // if the notification flag is "na" i.e by name then it will prompt user to enter its name
    if(this.selectedRestaurant.orderNotiFlag=="na"){
      this.presentPrompt();
    } else { // if notification is not set to na, order will be sent without prompting user's name
     this.notifyAtEndOrder(); // this is for the notification is "nu" i.e by number
     this.sendOrder();
    }
  }
  cancel(): void {
    this.navCtrl.setRoot(WelcomePage);
  }

  sendOrder(): void{
    var payFirst = false;
    if (payFirst && this.platform.is('cordova')) {
      this.usePayPal();
    } else {
      this.orderService.placeOrder(this.currentOrder).subscribe(response=> {
        this.navCtrl.setRoot(WelcomePage);
      });
    }
  }

  usePayPal(): void {
    var self = this;
    PayPal.init({
      "PayPalEnvironmentProduction": this.selectedRestaurant.paypalId,
      "PayPalEnvironmentSandbox": "AaSdrzWXMJWXl_fxul1Q6KstQTlUgEfs7gmJ2qwrAPscdTUleVbZTEwj7NZIpZYYSy0xDzPCC4_zLgn3"
    }).then(() => {
      PayPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({})).then(
        () => {
          let payment = new PayPalPayment(self.currentOrder.total.toString(), 'CAD', 'Pay Order', 'sale');
          PayPal.renderSinglePaymentUI(payment).then(
            (response) => {
              self.currentOrder.paymentId = response.response.id;
              self.orderService.placeOrder(self.currentOrder).subscribe(response=> {
                self.navCtrl.setRoot(WelcomePage);
              });
            }, () => {

            }
          );
        }, () => {

        });
    }, () => {

    });
  }


    notifyAtEndOrder(): void{
      var self = this;
      // if the notification flag is "nu" i.e by number then it will show the order number to the user
      if(this.selectedRestaurant.orderNotiFlag=="nu"){
        self.currentOrder.notifyOrderDetail = this.generateOrderNumber();
        this.presentAlert();
      }
    }



    changeGroup(name: string, category: Category): void {
     if(name == 'all') {
        this.showAllCategories = true;
      } else {
          this.showAllCategories = false;
          this.currentCategory = category;
          this.currentCategory.items = category.items;
      }
    }

    // basic alert for order notification by number
    presentAlert() {
       // for ng2-translate, get text from translation from json files
      var text;
      this.translate.get('orderNoti').subscribe(
        value => {
          // value is our translated string from json files
          text = value;
        }
      )
      var self = this;
      let alert = this.alertCtrl.create({
        title: text.byNumberTitle,
        subTitle: text.byNumberSubtitle + self.currentOrder.notifyOrderDetail,
        buttons: [text.byNumberButton]
        });
      alert.present();
    }

    // generated order number for order notfication by number
    // generation is based on time which will minimized number collision
    generateOrderNumber() {
      var date = new Date();
      return date.getSeconds()+""+date.getMilliseconds();
    }


    // prompt alert for order notification by name
    presentPrompt() {
    // for ng2-translate, get text from translation from json files
    var text;
    this.translate.get('orderNoti').subscribe(
      value => {
        // value is our translated string from json files
        text = value;
      }
    )
      var self=this;
      let alert = this.alertCtrl.create({
        title: text.byNameTile,
        inputs: [
          {
            name: 'name',
            placeholder: text.byNamePlaceholder,
            type: 'string'
          }
        ],
        buttons: [
          {
            text: text.cancelButton,
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: text.submitButton,
            handler: data => {
              if (data.name) {
                self.currentOrder.notifyOrderDetail = data.name;
                this.sendOrder();
              } else {
                // name cannot be empty, prompt will not close until valid entry
                return false;
              }
            }
          }
        ]
      });
      alert.present();
    }
}

function compareIngredientGroup (group1: IngredientGroup, group2: IngredientGroup) {
  if (group1.orderPriority < group2.orderPriority) {
    return -1;
  } else if (group1.orderPriority > group2.orderPriority) {
    return 1;
  } else {
  	return 0;
  }
}
