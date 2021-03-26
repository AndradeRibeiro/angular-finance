import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { Entry } from './entry.model';
import { CategoryService } from "../../categories/shared/category.service";
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector,
              private _categoryService: CategoryService) { 
                super('api/entries', injector, Entry.fromJson)
              }

  create(entry: Entry): Observable<Entry> {
    return this._categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {     
        entry.category = category; // this is necessary because i'm using in-memory-database
        return super.create(entry)
      })
    )
  }

  update(entry: Entry): Observable<Entry> {
    return this._categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {    
        entry.category = category; // this is necessary because i'm using in-memory-database
        return super.update(entry)
      })
    ) 
  }
}
