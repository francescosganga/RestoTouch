import {Component, OnInit} from '@angular/core';
import {Item} from './../../shared/models/items';
import {Size} from './../../shared/models/size';
import {ItemService} from './item.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
@Component({
  moduleId: module.id,
  selector: 'item-cmp',
  templateUrl: 'item.component.html',
  providers: [ItemService]
})

export class ItemComponent implements OnInit {
  item = new Item('', '', '', [new Size('Regular', 0)]);
  size = new Size('', 0);
  errorMessage: any;

  constructor(private itemService: ItemService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['id']) {
        this.itemService.getItem(params['id']).subscribe(item => {
          this.item = item;
        }, error => {
          console.log(error);
        });
      }
    });
  }

  onSubmit() {
    this.itemService.addItem(this.item).subscribe(
      generalResponse => {
        this.router.navigate(['/dashboard/items']);
      },
      error => {
        this.errorMessage = <any> error;
      }
    );

  }

  addSize() {
    this.item.sizes.push(this.size);
    this.size = new Size('', 0);
  }

  removeSize(size: Size) {
    let sizeToRemove = this.item.sizes.find(currentSize => currentSize.name === size.name);
    this.item.sizes.splice(this.item.sizes.indexOf(sizeToRemove), 1);
  }

  newItem() {
    this.item = new Item('', '', '');
  }
}
