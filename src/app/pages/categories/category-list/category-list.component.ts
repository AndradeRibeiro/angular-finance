import { Component, OnInit } from '@angular/core';
import toastr from 'toastr';

import { Category } from "../shared/category.model";
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private _categoryService: CategoryService) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this._categoryService.getAll().subscribe(
      categories => this.categories = categories,
      () => toastr.error('Ocorreu um erro ao carregar a lista')
    )
  }

  delete(category: Category) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete) {
      this._categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element != category),
        () => toastr.error('Ocorreu um erro ao tentar excluir')
      )
    }  
  }
}
