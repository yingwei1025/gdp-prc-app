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

@NgModule({
  declarations: [SpinnerComponent, MaterialElevationDirective, CagrDialogComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, FlexLayoutModule],
  exports: [
    MaterialModule,
    SpinnerComponent,
    MaterialElevationDirective,
    CagrDialogComponent,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  entryComponents: [CagrDialogComponent]
})
export class SharedModule {}
