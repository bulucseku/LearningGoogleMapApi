import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent {
  @Input() items: any;
  
  constructor() {
    this.items = [];
  }

}
