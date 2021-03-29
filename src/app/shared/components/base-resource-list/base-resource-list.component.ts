import { OnInit, Directive } from '@angular/core';
import toastr from 'toastr';

import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResourceService } from '../../services/base-resource.service';

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(protected resourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.resourceService.getAll().subscribe(
      resources => this.resources = resources.sort((a, b) => b.id - a.id),
      () => toastr.error('Ocorreu um erro ao carregar a lista')
    )
  }

  delete(resource: T) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete) {
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element != resource),
        () => toastr.error('Ocorreu um erro ao tentar excluir')
      )
    }  
  }

}
