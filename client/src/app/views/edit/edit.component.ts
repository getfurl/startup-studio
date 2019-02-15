import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  id: string;

  constructor(private _activatedRoute: ActivatedRoute) { 
    this._activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id;
    })
  }

  ngOnInit() {
  }

}
