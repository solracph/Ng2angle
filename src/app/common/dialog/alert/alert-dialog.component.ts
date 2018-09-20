
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'alert-dialog',
    templateUrl: 'alert-dialog.component.html',
    styles: ['alert-dialog.component.scss'] 
  })
  export class AlertDialogComponent {
  
    constructor (
        public dialogRef: MatDialogRef<AlertDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    close(): void {
        this.dialogRef.close();
    }
}