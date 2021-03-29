import { OnInit, AfterContentChecked, Injector, Directive } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResourceService } from "../../services/base-resource.service";

@Directive()
export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(public resource: T,
              protected injector: Injector,
              protected resourceService: BaseResourceService<T>,
              protected jsonDataToResourceFn: (jsonData: any) => T) {
       
    this.route = injector.get(ActivatedRoute);  
    this.router = injector.get(Router);
    this.formBuilder = injector.get(FormBuilder);          
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  actionsForSuccess(resource: T) {
    toastr.success('Salvo com sucesso!');

    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

    this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(
      () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
    )
  }

  actionsFoError(error: any) {
    toastr.error('Ocorreu um erro ao salvar!');

    this.submittingForm = false;

    if(error.status == 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else 
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."];
  }

  setCurrentAction() {
    this.route.snapshot.url[0].path == 'new' ? this.currentAction = 'new' : this.currentAction = 'edit'
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == 'new')
      this.create();
    else
      this.update();
  }

  protected create() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    
    this.resourceService.create(resource).subscribe(
      resource => this.actionsForSuccess(resource),
      error => this.actionsFoError(error)
    )
  }

  protected update() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    
    this.resourceService.update(resource).subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsFoError(error)
    )
  }

  protected loadResource() {
    if(this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get('id')))
      ).subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource);
        },
        () => toastr.error('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  protected setPageTitle() {
    if (this.currentAction == 'new') 
      this.pageTitle = this.creationPageTitle();
    else {
        this.pageTitle = this.editionPageTitle();;
    }
  }

  protected creationPageTitle() {
    return 'Novo'
  }

  protected editionPageTitle() {
    return 'Edição'
  }

  protected abstract buildResourceForm(): void;
}
