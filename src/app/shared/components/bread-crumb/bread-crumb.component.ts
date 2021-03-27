import { Component, OnInit, Input } from '@angular/core';

import { IBreadCrumbItem } from '../../interfaces/bread-crumb.interface';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss']
})
export class BreadCrumbComponent implements OnInit {

  @Input() items: Array<IBreadCrumbItem> = [];

  constructor() { }

  ngOnInit() {
  }

  isTheLastItem(item: IBreadCrumbItem): boolean {
    const index = this.items.indexOf(item);
    return index + 1 == this.items.length;
  }

}
