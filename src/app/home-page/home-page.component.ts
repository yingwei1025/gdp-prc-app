// GDP-PRC-Project
// Author: yingwei1025@gmail.com

import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppConstant } from '@app/app.constants';
import { errorMessages } from '@app/_models/error-msg';
import { CommonService } from '@app/_services/common.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CagrDialogComponent } from '@app/_shared/cagr-dialog/cagr-dialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GpdPpcElement } from '@app/_models/table-model';
import { StockNameDialogComponent } from '@app/_shared/stock-name-dialog/stock-name-dialog.component';
import * as XLSX from 'xlsx';
import { TableUtil } from '@app/_services/table-util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  title = '冷眼 GDP PRC Calculator 自动计算器 ';
  loading = false;
  reqCount = 0;
  inputGap = '5%';
  resultDivGap = '20px';
  errors = errorMessages;
  defaultElevation = 5;
  raisedElevation = 12;
  dialogRef: MatDialogRef<any>;
  calForm: FormGroup;
  fieldControl: {
    [key: string]: AbstractControl;
  };
  cashFlowList = [
    {
      desc: 'Profit Loss + Negative Cash Flow',
      data: 'lossNeg'
    },
    {
      desc: 'Profit Loss + Positive Cash Flow',
      data: 'lossPos'
    },
    {
      desc: 'Profit Gain + Negative Cash Flow',
      data: 'profitNeg'
    },
    {
      desc: 'Profit Gain + Positive Cash Flow',
      data: 'profitPos'
    }
  ];
  isShowResultDiv = false;
  isShowTableDiv = true;
  growthResult: number;
  dividenResult: number;
  peResult: number;
  profitResult: number;
  roeResult: number;
  cashResult: any;
  growthData: number;
  dividendData: number;
  peData: number;
  profitData: number;
  roeData: number;
  cashFlowData: any;
  totalGDP: number;
  totalPRC: number;
  gdpFinalResult = AppConstant.CT_EMPTY;
  prcFinalResult = AppConstant.CT_EMPTY;
  gdpFinalTextCSS = AppConstant.CT_EMPTY;
  prcFinalTextCSS = AppConstant.CT_EMPTY;
  gdpfinalPointCss = AppConstant.CT_EMPTY;
  prcfinalPointCss = AppConstant.CT_EMPTY;
  displayedColumns = ['stock', 'gpd', 'prc', 'growth', 'dividend', 'pe', 'profit', 'roe', 'cash', 'star'];
  dataSource = new MatTableDataSource();
  stockName: any;
  tempTableIndex: any;

  constructor(private fb: FormBuilder, private commonService: CommonService, public dialog: MatDialog) {
    this.formLoad();
  }

  ngOnInit(): void {}

  public formLoad(): void {
    this.calForm = this.fb.group({
      growthField: [AppConstant.CT_EMPTY, Validators.required],
      dividendField: [AppConstant.CT_EMPTY, Validators.required],
      peField: [AppConstant.CT_EMPTY, Validators.required],
      profitField: [AppConstant.CT_EMPTY, Validators.required],
      roeField: [AppConstant.CT_EMPTY, Validators.required],
      cashFlowField: [AppConstant.CT_EMPTY, Validators.required]
    });
    this.fieldControl = this.calForm.controls;
  }

  public goToNewTabUrl(url): void {
    window.open(url, '_blank');
  }

  public onCalResult(): void {
    this.calForm.valid ? this.calResult() : this.onValidateForm();
  }

  public bugReport(): void {
    this.goToNewTabUrl('https://forms.gle/EzT4TLDPrLeMsbnDA');
  }

  public buyBook(): void {
    this.goToNewTabUrl(
      'https://www.popularonline.com.my/cnsimplified/catalog/product/view/_ignore_category/1/id/162729/s/9789839537130/?did=8'
    );
  }

  public onValidateForm(): void {
    Object.keys(this.calForm.controls).forEach(field => {
      const control = this.calForm.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  public calResult(): void {
    this.showLoading();
    this.isShowResultDiv = true;
    const formValue = this.calForm.value;
    this.prepareData(formValue);
    this.scrollTo('#resultAncor');
    this.delay();
  }

  public async delay() {
    await this.delayTime(1);
    this.scrollTo('#resultAncor');
    await this.delayTime(900);
    this.hideLoading();
  }

  public delayTime(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public scrollTo(where): void {
    this.commonService.scrollTo(where, true);
  }

  public openCagrDialog(): void {
    const data = [];
    this.dialogRef = this.dialog.open(CagrDialogComponent, {
      data: data,
      width: '300px',
      height: '420px',
      autoFocus: false,
      restoreFocus: false
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (this.commonService.checkStringValid(result)) {
        this.scrollTo('#calForm');
        this.fieldControl['growthField'].setValue(result);
      }
    });
  }

  public prepareData(data): void {
    this.growthData = data.growthField;
    this.dividendData = data.dividendField;
    this.peData = data.peField;
    this.profitData = data.profitField;
    this.roeData = data.roeField;
    this.cashFlowData = this.fieldControl[`cashFlowField`].value.data;

    this.calGDP(this.growthData, this.dividendData, this.peData);
    this.calPRC(this.profitData, this.roeData, this.cashFlowData);
    const temp = this.cashFlowList.filter(x => x.data === this.cashFlowData);
    this.cashFlowData = temp[0].desc;
  }

  public calGDP(g, d, p): void {
    let gTemp: number;
    if (g >= 1 && g <= 5) {
      gTemp = 20;
    } else if (g > 5 && g <= 9) {
      gTemp = 30;
    } else if (g > 9 && g <= 14) {
      gTemp = 40;
    } else if (g > 14) {
      gTemp = 50;
    } else {
      gTemp = 0;
    }
    this.growthResult = gTemp;

    let dTemp: number;
    if (d >= 1 && d <= 2) {
      dTemp = 5;
    } else if (d > 2 && d <= 4) {
      dTemp = 10;
    } else if (d > 4 && d <= 6) {
      dTemp = 15;
    } else if (d > 6) {
      dTemp = 20;
    } else {
      dTemp = 0;
    }
    this.dividenResult = dTemp;

    let pTemp: number;
    if (p > 24) {
      pTemp = 5;
    } else if (p > 15 && p <= 24) {
      pTemp = 10;
    } else if (p > 9 && p <= 15) {
      pTemp = 20;
    } else if (p >= 0 && p <= 9) {
      pTemp = 30;
    } else {
      pTemp = 0;
    }
    this.peResult = pTemp;
    this.totalGDP = this.growthResult + this.dividenResult + this.peResult;

    if (this.totalGDP >= 50) {
      this.gdpFinalResult = AppConstant.CT_PASS;
      this.gdpFinalTextCSS = 'pass';
      this.gdpfinalPointCss = 'pass-point';
    } else {
      this.gdpFinalResult = AppConstant.CT_FAIL;
      this.gdpFinalTextCSS = 'fail';
      this.gdpfinalPointCss = 'fail-point';
    }
  }

  public calPRC(p, r, c): void {
    let prTemp: number;
    if (p >= 1 && p <= 5) {
      prTemp = 5;
    } else if (p > 5 && p <= 10) {
      prTemp = 10;
    } else if (p > 10 && p <= 15) {
      prTemp = 15;
    } else if (p > 15) {
      prTemp = 20;
    } else {
      prTemp = 0;
    }
    this.profitResult = prTemp;

    let rTemp: number;
    if (r >= 1 && r <= 5) {
      rTemp = 10;
    } else if (r > 5 && r <= 10) {
      rTemp = 20;
    } else if (r > 10 && r <= 15) {
      rTemp = 30;
    } else if (r > 15) {
      rTemp = 40;
    } else {
      rTemp = 0;
    }
    this.roeResult = rTemp;
    let cTemp: number;
    if (c === 'lossNeg') {
      cTemp = 1;
    } else if (c === 'lossPos') {
      cTemp = 20;
    } else if (c === 'profitNeg') {
      cTemp = 30;
    } else if (c === 'profitPos') {
      cTemp = 40;
    } else {
      cTemp = 0;
    }
    this.cashResult = cTemp;
    this.totalPRC = this.profitResult + this.roeResult + this.cashResult;

    if (this.totalPRC >= 50) {
      this.prcFinalResult = AppConstant.CT_PASS;
      this.prcFinalTextCSS = 'pass';
      this.prcfinalPointCss = 'pass-point';
    } else {
      this.prcFinalResult = AppConstant.CT_FAIL;
      this.prcFinalTextCSS = 'fail';
      this.prcfinalPointCss = 'fail-point';
    }
  }

  public openStockNameDialog(): void {
    const data = [];
    this.dialogRef = this.dialog.open(StockNameDialogComponent, {
      data: data,
      width: '300px',
      height: '230px',
      autoFocus: false,
      restoreFocus: false
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (this.commonService.checkStringValid(result)) {
        this.stockName = result;
        this.addToTable(result);
      }
    });
  }

  public async addToTable(stockName: String): Promise<void> {
    this.isShowTableDiv = true;
    const obj: GpdPpcElement = {
      stock: String(stockName),
      gpd: String(this.gdpFinalResult + ' ' + this.totalGDP + ' Point '),
      gpdColor: this.totalGDP >= 50 ? 'green' : 'red',
      prc: String(this.prcFinalResult + ' ' + this.totalPRC + ' Point '),
      prcColor: this.totalPRC >= 50 ? 'green' : 'red',
      growth: String(this.growthData + '%'),
      dividend: String(this.dividenResult + '%'),
      pe: String(this.peResult + '%'),
      profit: String(this.profitResult + '%'),
      roe: String(this.roeResult + '%'),
      cash: String(this.cashFlowData)
    };
    this.dataSource.data.unshift(obj);
    console.log(this.dataSource.data);
    if (this.table) {
      this.table.renderRows();
      this.scrollTo('#compareListAncor');
    } else {
      await this.delayTime(300);
      this.table.renderRows();
      this.scrollTo('#compareListAncor');
    }
    this.commonService.openSnackBar('Insert Complete !');
  }

  public getTableIndex(index): void {
    this.tempTableIndex = index;
    console.log(index);
  }

  public deleteTableItem(): void {
    // find item and remove ist
    this.dataSource.data.splice(this.dataSource.data.indexOf(this.tempTableIndex), 1);
    this.table.renderRows();
    this.commonService.openSnackBar('Delete Complete !');
  }

  exportTable() {
    TableUtil.exportTableToExcel('MaterialTable');
    this.commonService.openSnackBar('Export Complete !');
  }

  public clearTableData(): void {
    this.dataSource.data = [];
    this.scrollTo('#compareListAncor');
    this.commonService.openSnackBar('Clear List Complete !');
  }

  public showLoading(): void {
    this.reqCount++;
    this.loading = true;
  }

  public hideLoading(): void {
    if (this.reqCount > 0) {
      this.reqCount--;
    }
    if (this.reqCount === 0) {
      this.loading = false;
    }
  }

  public async onClear(): Promise<void> {
    this.scrollTo('#calForm');
    this.growthResult = 0;
    this.dividenResult = 0;
    this.peResult = 0;
    this.profitResult = 0;
    this.roeResult = 0;
    this.cashResult = '';
    this.formLoad();
    await this.delayTime(600);
    this.isShowResultDiv = false;
  }
}
