// GDP-PRC-Project
// Author: yingwei1025@gmail.com

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConstant } from '@app/app.constants';
import { FormGroup, AbstractControl, Validators, FormBuilder, FormControl } from '@angular/forms';
import { errorMessages } from '@app/_models/error-msg';

@Component({
  selector: 'app-stock-name-dialog',
  templateUrl: './stock-name-dialog.component.html',
  styleUrls: ['./stock-name-dialog.component.scss']
})
export class StockNameDialogComponent implements OnInit {
  errors = errorMessages;
  dialogData = [];
  dialogTitle = 'Please Enter the Stock Name';
  calForm: FormGroup;
  fieldControl: {
    [key: string]: AbstractControl;
  };
  stockName: string;

  constructor(
    public dialogRef: MatDialogRef<StockNameDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.formLoad();
    this.dialogRef.disableClose = false;
  }

  ngOnInit() {}

  public formLoad(): void {
    this.calForm = this.fb.group({
      stockName: [AppConstant.CT_EMPTY, Validators.required]
    });
    this.fieldControl = this.calForm.controls;
  }

  public handleKeyUp(e): void {
    if (e.keyCode === 13) {
      this.onSave();
    }
  }

  public onSave(): void {
    this.calForm.valid ? this.setName() : this.onValidateForm();
  }

  public setName(): void {
    this.dialogRef.close(this.fieldControl['stockName'].value);
  }

  public onValidateForm(): void {
    Object.keys(this.calForm.controls).forEach(field => {
      const control = this.calForm.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
