import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import toastr from 'toastr';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> {

  categories: Array<Category>;
  typeOptions = [];

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  }

  constructor(protected entryService: EntryService,
              protected categoryService: CategoryService,
              protected injector: Injector){

    super(new Entry(), injector, entryService, Entry.fromJson);
  }

  ngOnInit() {
    this.loadCategories();
    this.typeOptions = Entry.typeOptions();
    super.ngOnInit();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories,
      () => toastr.error('Ocorreu um erro ao carregar a lista de categorias')
    )
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      description: [null],
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid:  [true, [Validators.required]],
      categoryId:  [null, [Validators.required]]
    })
  }
}
