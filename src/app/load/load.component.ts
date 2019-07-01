import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FileUploader, FileSelectDirective} from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit {
  @ViewChild('myForm', {static: false}) formValues: any;

  public uploader: FileUploader = new FileUploader({
    url: 'http://localhost:3000/load',
    itemAlias: 'text'
  });

  err = true;

  constructor(protected change: ChangeDetectorRef) { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (fileItem => {
      fileItem.withCredentials = false;
    });
    this.uploader.onCompleteItem = ((item, response, status1, headers) => {
      if (!item._file.name.endsWith('.txt')) {
        this.err = false;
      }
      this.formValues.resetForm();
      this.change.detectChanges();
      console.log('FileUpload: ', item, status1);
    });
  }

  hide() {
    this.err = true;
  }

}
