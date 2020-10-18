// GDP-PRC-Project
// Author: yingwei1025@gmail.com

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/_shared/material.module';
import { SpinnerComponent } from '@app/_shared/spinner/spinner.component';
import { MaterialElevationDirective } from '@app/_directives/material-elevation.directive';
import { CagrDialogComponent } from './cagr-dialog/cagr-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StockNameDialogComponent } from './stock-name-dialog/stock-name-dialog.component';
import { AutoFocusDirective } from '@app/_directives/auto-focus.directive';

@NgModule({
  declarations: [
    SpinnerComponent,
    MaterialElevationDirective,
    AutoFocusDirective,
    CagrDialogComponent,
    StockNameDialogComponent
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, FlexLayoutModule],
  exports: [
    MaterialModule,
    SpinnerComponent,
    MaterialElevationDirective,
    AutoFocusDirective,
    CagrDialogComponent,
    StockNameDialogComponent,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  entryComponents: [CagrDialogComponent, StockNameDialogComponent]
})
export class SharedModule {}
