
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'dialog-yes-or-no',
    templateUrl: 'dialog-yes-or-no.component.html',
    styleUrls: ['dialog-yes-or-no.component.scss']
  })
  export class DialogYesNoComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogYesNoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    
    ngOnInit(){
    }
  
    yes(): void {
        this.dialogRef.close({result:true});
    };

    no(){
        this.dialogRef.close({result:false});
    };
}