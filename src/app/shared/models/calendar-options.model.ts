export class Month {

    static months = {
        1: 'Janeiro',
        2: 'Fevereiro',
        3: 'Março',
        4: 'Abril',
        5: 'Maio',
        6: 'Junho',
        7: 'Julho',
        8: 'Agosto',
        9: 'Setembro',
        10: 'Outubro',
        11: 'Novembro',
        12: 'Dezembro'
    };

    static getMonthOptions(): Array<any> {
        return Object.entries(Month.months).map(
          ([value, text]) => {
            return {
              text: text,
              value: value
            }
          }
        )
    }
}

export class Year {
    static years = {
        1: '2021',
        2: '2020',
        3: '2019',
        4: '2018',
        5: '2017',
        6: '2016',
        7: '2015'
    }

    static getYearOptions(): Array<any> {
        return Object.entries(Year.years).map(
          ([value, text]) => {
            return {
              text: text,
              value: text
            }
          }
        )
    }
}