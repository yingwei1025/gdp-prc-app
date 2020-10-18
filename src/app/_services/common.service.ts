// GDP-PRC-Project
// Author: yingwei1025@gmail.com

import { Injectable } from '@angular/core';
import { AppConstant } from '@app/app.constants';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private _snackBar: MatSnackBar) {}

  public scrollTo(where: string, smooth: boolean): void {
    const scrollElem = document.querySelector(where);
    if (smooth) {
      scrollElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      scrollElem.scrollIntoView();
    }
  }

  public verifyNumber(data): number {
    return data === AppConstant.CT_EMPTY || data === null || data === undefined ? '' : data;
  }

  public checkStringValid(text: string): boolean {
    return text !== null && text !== AppConstant.CT_EMPTY && text !== undefined && text !== 'null' ? true : false;
  }

  public calCagrRate(beginValue: number, finalValue: number, numerOfYear: number): number {
    const tempNumYear = 1 / numerOfYear;
    const value = finalValue / beginValue;
    let result = Math.pow(value, tempNumYear);
    result = (result - 1) * 100;
    result = this.round2(result);
    return result;
  }

  public round2(num: number) {
    return Math.round(num * 100) / 100;
  }

  public openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }
}
