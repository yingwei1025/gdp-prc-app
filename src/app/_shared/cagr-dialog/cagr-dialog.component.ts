// GDP-PRC-Project
// Author: yingwei1025@gmail.com

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConstant } from '@app/app.constants';
import { FormGroup, AbstractControl, Validators, FormBuilder, FormControl } from '@angular/forms';
import { errorMessages } from '@app/_models/error-msg';
import { CommonService } from '@app/_services/common.service';

@Component({
  selector: 'app-cagr-dialog',
  templateUrl: './cagr-dialog.component.html',
  styleUrls: ['./cagr-dialog.component.scss']
})
export class CagrDialogComponent implements OnInit {
  errors = errorMessages;
  dialogData = [];
  dialogTitle = 'CAGR Calculator';
  calForm: FormGroup;
  fieldControl: {
    [key: string]: AbstractControl;
  };
  cagrResult: number;
  cagrStringResult: string;

  constructor(
    public dialogRef: MatDialogRef<CagrDialogComponent>,
    private fb: FormBuilder,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.formLoad();
    this.dialogRef.disableClose = false;
  }

  ngOnInit() {}

  private formLoad(): void {
    this.calForm = this.fb.group({
      beginValueField: [AppConstant.CT_EMPTY, Validators.required],
      finalValueField: [AppConstant.CT_EMPTY, Validators.required],
      numberOfYearField: [5, Validators.required]
    });
    this.fieldControl = this.calForm.controls;
  }

  private onSave(): void {
    this.calForm.valid ? this.calCagr() : this.onValidateForm();
  }

  private calCagr(): void {
    this.dialogRef.close(this.cagrResult);
  }

  private prepareData() {
    const formValue = this.calForm.value;
    const dataList = {
      beginValue: formValue.beginValueField,
      finalValue: formValue.finalValueField,
      numerOfYear: formValue.numberOfYearField
    };
    return dataList;
  }

  private onValidateForm(): void {
    Object.keys(this.calForm.controls).forEach(field => {
      const control = this.calForm.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  private onKeyUpCal(): void {
    const completeData = this.prepareData();
    if (
      this.commonService.verifyNumber(completeData.beginValue) &&
      this.commonService.verifyNumber(completeData.finalValue) &&
      this.commonService.verifyNumber(completeData.numerOfYear)
    ) {
      this.cagrResult = this.commonService.calCagrRate(
        completeData.beginValue,
        completeData.finalValue,
        completeData.numerOfYear
      );
      this.cagrStringResult = String(this.cagrResult);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
