import { Component, OnInit, EventEmitter,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Toastr } from 'src/app/services/toastr.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategorySaleService } from 'src/app/services/category-sale/category-sale.service';

@Component({
  selector: 'app-trash-one-category-sale',
  templateUrl: './trash-one-category-sale.component.html',
  styleUrls: ['./trash-one-category-sale.component.scss']
})
export class TrashOneCategorySaleComponent implements OnInit {
  onRestoreCategory = new EventEmitter();
  onDestroyCategory = new EventEmitter();
  dialogAction: any = 'restore';
  action: any = 'restore';
  responseMessage: any;
  details: any = {}

  labelMessage: string = 'Khôi phục';
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private categorySaleService: CategorySaleService,
    public dialogRef: MatDialogRef<TrashOneCategorySaleComponent>,
    private toastr: Toastr
  ) {}

  ngOnInit() {
    if (this.dialogData.action === 'destroy') {
      this.labelMessage = "Xóa"
      this.dialogAction = 'destroy';
      this.action = 'destroy';
    }

    if (this.dialogData) {
      this.details = this.dialogData;
    }
  }

  handleChangeAction() {
    if(this.dialogAction === 'restore'){
      this.restore();
    }else{
      this.destroy();
    }
  }


  async restore() {

    var data = {
      id: this.dialogData.data.id,
    };
    let response = await this.categorySaleService.restore(data);
    if (response.results.responseCode == '200') {
      this.dialogRef.close();
      this.onRestoreCategory.emit();
      this.responseMessage = response.results.message;
      this.toastr.toastSuccess(this.responseMessage, 'Thành công');
    } else {
      this.dialogRef.close();
      if (response.results.message) {
        this.responseMessage = response.results.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.toastr.toastError(this.responseMessage, 'Lỗi');
    }
  }

  async destroy() {
    let response = await this.categorySaleService.destroy(this.dialogData.data.id);
    if (response.results.responseCode == '200') {
      this.dialogRef.close();
      this.onDestroyCategory.emit();
      this.responseMessage = response.results.message;
      this.toastr.toastSuccess(this.responseMessage, 'Thành công');
    } else {
      this.dialogRef.close();
      if (response.results.message) {
        this.responseMessage = response.results.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.toastr.toastError(this.responseMessage, 'Lỗi');
    }
  }

}
