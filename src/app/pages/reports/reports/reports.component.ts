import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import toastr from "toastr";
import currencyFormatter from "currency-formatter";

import { Category } from "../../categories/shared/category.model";
import { CategoryService } from "../../categories/shared/category.service";

import { Entry } from "../../entries/shared/entry.model";
import { EntryService } from "../../entries/shared/entry.service";

import { Month } from "../../../shared/models/calendar-options.model";
import { Year } from "../../../shared/models/calendar-options.model";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  @ViewChild('month', { static: true }) month: ElementRef = null;
  @ViewChild('year', { static: true }) year: ElementRef = null;

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  monthOptions = [];
  yearOptions = [];

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{
          ticks: {
          beginAtZero: true
        }
      }]
    }
  }

  categories: Category[] = [];
  entries: Entry[] = [];

  constructor(private _categoryService: CategoryService,
              private _entryService: EntryService) { }

  ngOnInit() {
    this.getCategories();
    this.getEntries();
    this.monthOptions = Month.getMonthOptions();
    this.yearOptions = Year.getYearOptions();
  }

  getCategories() {
    this._categoryService.getAll().subscribe(
      categories => this.categories = categories,
      () => toastr.error('Ocorreu um erro ao listar as categorias.')
    )
  }

  getEntries() {
    this._entryService.getAll().subscribe(
      entries => this.entries = entries,
      () => toastr.error('Ocorreu um erro ao listar os lançamentos.')
    )
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if (!month || !year)
      alert('Você precisa informar o mês e o ano para gerar os relatórios')
    else
      this._entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this))  
  }

  setValues(entries: Entry[]) {
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance() {
    let expenseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach(entry => {
      if(entry.type == 'revenue')
        revenueTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' });
      else
        expenseTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' });
    });

    this.expenseTotal = currencyFormatter.format(expenseTotal, { code: 'BRL' });
    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: 'BRL' });
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, { code: 'BRL' })
  }

  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#e03131');
  }

  private getChartData(entryType: string, title: string, color: string) {
    const chartData = [];

    this.categories.forEach(category => {

      const filteredEntries = this.entries.filter(
        entry => (entry.categoryId == category.id) && (entry.type == entryType)
      );

      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce(
          (total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL' }), 0
        )

        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        })
      }
    });

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [
        {
          label: title,
          backgroundColor: color,
          data: chartData.map(item => item.totalAmount)
        }
      ]
    }
  }
}
