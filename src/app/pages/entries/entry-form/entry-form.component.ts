import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category>;

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

  constructor(private _entryService: EntryService,
              private _categoryService: CategoryService,
              private _route: ActivatedRoute,
              private _router: Router,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.serCurrentAction();
    this.buildentryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == 'new')
      this.create();
    else
      this.update();
  }

  create() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    
    this._entryService.create(entry).subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsFormError(error)
    )
  }

  update() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    
    this._entryService.update(entry).subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsFormError(error)
    )
  }

  actionsForSuccess(entry: Entry) {
    toastr.success('Salvo com sucesso!');
    this._router.navigateByUrl('entries', { skipLocationChange: true }).then(
      () => this._router.navigate(['entries', entry.id, 'edit'])
    )
  }

  actionsFormError(error: any) {
    toastr.error('Ocorreu um erro ao salvar!');

    this.submittingForm = false;

    if(error.status == 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else 
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."];
  }

  serCurrentAction() {
    this._route.snapshot.url[0].path == 'new' ? this.currentAction = 'new' : this.currentAction = 'edit'
  }

  buildentryForm() {
    this.entryForm = this._formBuilder.group({
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

  loadEntry() {
    if(this.currentAction == 'edit') {
      this._route.paramMap.pipe(
        switchMap(params => this._entryService.getById(+params.get('id')))
      ).subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry);
        },
        () => toastr.error('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  loadCategories() {
    this._categoryService.getAll().subscribe(
      categories => this.categories = categories,
      () => toastr.error('Ocorreu um erro ao carregar a lista de categorias')
    )
  }

  setPageTitle() {
    if (this.currentAction == 'new') 
      this.pageTitle = 'Cadastrando Lançamento'
    else {
      const entryName = this.entry.name || '';
      this.pageTitle = `Editando Lançamento: ${entryName}`;
    }
  }
}
