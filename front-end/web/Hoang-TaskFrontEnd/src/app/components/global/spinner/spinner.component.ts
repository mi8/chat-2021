import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  spinner1 = 'sp1';
  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.spinner.show();
  }
}
