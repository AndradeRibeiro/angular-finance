import { Component, OnInit } from '@angular/core';
import toastr from 'toastr';

import { Entry } from "../shared/entry.model";
import { EntryService } from '../shared/entry.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private _entryService: EntryService) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this._entryService.getAll().subscribe(
      entries => this.entries = entries.sort((a, b) => b.id - a.id),
      () => toastr.error('Ocorreu um erro ao carregar a lista')
    )
  }

  delete(entry: Entry) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete) {
      this._entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(element => element != entry),
        () => toastr.error('Ocorreu um erro ao tentar excluir')
      )
    }  
  }
}
