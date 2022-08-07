export default class DateManager {
  static getWeekShortText(weekDay: number): string {
    if (weekDay < 0 || weekDay > 6) return '';
    const MONTH_LIST = ['Sun', 'Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat']
    return MONTH_LIST[weekDay]
  }

  static getMonthShortText(month: number): string {
    if (month > 11 || month < 0) return '';
    const MONTH_LIST = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    return MONTH_LIST[month]
  }

  static getWeekDays(today: Date = new Date()) {
    const monday = new Date(today);
    const tuesday = new Date(today);
    const wednesday = new Date(today);
    const thursday = new Date(today);
    const friday = new Date(today);
    const saturday = new Date(today);
    const sunday = new Date(today);
    monday.setDate(today.getDate() - (today.getDay() > 0 ? today.getDay() : 7) + 1);
    tuesday.setDate(today.getDate() - (today.getDay() > 0 ? today.getDay() : 7) + 2);
    wednesday.setDate(today.getDate() - (today.getDay() > 0 ? today.getDay() : 7) + 3);
    thursday.setDate(today.getDate() - (today.getDay() > 0 ? today.getDay() : 7) + 4);
    friday.setDate(today.getDate() - (today.getDay() > 0 ? today.getDay() : 7) + 5);
    saturday.setDate(today.getDate() - (today.getDay() > 0 ? today.getDay() : 7) + 6);
    sunday.setDate(today.getDate() - (today.getDay() > 0 ? today.getDay() : 7) + 7);
    return [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
  }

  static getPeriodDateText(start: Date, end: Date) {
    let result = '';
    switch (start.getDay()) {
      case 1:
        result += 'Mon';
        break;
      case 2:
        result += 'Tue';
        break;
      case 3:
        result += 'Wed';
        break;
      case 4:
        result += 'Thu';
        break;
      case 5:
        result += 'Fri';
        break;
      case 6:
        result += 'Sat';
        break;
      case 7:
        result += 'Sun';
        break;
    }
    result += ', ';
    switch (start.getMonth()) {
      case 0:
        result += 'Jan';
        break;
      case 1:
        result += 'Feb';
        break;
      case 2:
        result += 'Mar';
        break;
      case 3:
        result += 'Apr';
        break;
      case 4:
        result += 'May';
        break;
      case 5:
        result += 'Jun';
        break;
      case 6:
        result += 'Jul';
        break;
      case 7:
        result += 'Aug';
        break;
      case 8:
        result += 'Sep';
        break;
      case 9:
        result += 'Oct';
        break;
      case 10:
        result += 'Nov';
        break;
      case 11:
        result += 'Dec';
        break;
    }
    result += ` ${start.getDate()} ⋅ `;
    result += this.getPeriodTimeText(start, end);
    return result;
  }

  static getPeriodTimeText(start: Date, end: Date) {
    let result = '';
    result += this.getTimeText(start);
    result += " - ";
    result += this.getTimeText(end);
    const offset = (end.getTime() - start.getTime()) / (1000 * 60);
    result += ` (${offset < 60 ? offset + 'min' : (offset / 60) + 'h'})`
    return result;
  }

  static getTimeText(time: Date) {
    return `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
  }

  static getWeekNumber(date: Date) {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const firstMonday = this.getWeekDays(oneJan)[0];
    const diffDays = this.getDiffDays(firstMonday, date);
    return Math.ceil(diffDays / 7);
  }

  static getDiffDays(date1: Date, date2: Date) {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
