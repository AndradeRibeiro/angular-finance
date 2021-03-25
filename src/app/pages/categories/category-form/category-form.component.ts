import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(private _categoryService: CategoryService,
              private _route: ActivatedRoute,
              private _router: Router,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.serCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == 'new')
      this.create();
    else
      this.update();
  }

  create() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    
    this._categoryService.create(category).subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsFormError(error)
    )
  }

  update() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    
    this._categoryService.update(category).subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsFormError(error)
    )
  }

  actionsForSuccess(category: Category) {
    toastr.success('Salvo com sucesso!');
    this._router.navigateByUrl('categories', { skipLocationChange: true }).then(
      () => this._router.navigate(['categories', category.id, 'edit'])
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

  buildCategoryForm() {
    this.categoryForm = this._formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description:  [null, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]]
    })
  }

  loadCategory() {
    if(this.currentAction == 'edit') {
      this._route.paramMap.pipe(
        switchMap(params => this._categoryService.getById(+params.get('id')))
      ).subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category);
        },
        () => toastr.error('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  setPageTitle() {
    if (this.currentAction == 'new') 
      this.pageTitle = 'Cadastrando Categoria'
    else {
      const categoryName = this.category.name || '';
      this.pageTitle = `Editando Categoria: ${categoryName}`;
    }
  }

}
