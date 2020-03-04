import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { List } from 'src/app/models/list';
import { ToDoServiceService } from 'src/app/to-do-service.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-list-component',
  templateUrl: './add-list-component.component.html',
  styleUrls: ['./add-list-component.component.css']
})
export class AddListComponentComponent implements OnInit {

  private newList :List;
  @Output() addList: EventEmitter<List> = new EventEmitter<List>();

  constructor(private listServ: ToDoServiceService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.newList = {
        title: '',
        description:'',
        _id:''

    }
  }

  public onSubmit() {
    this.listServ.addList(this.newList).subscribe(
        response=> {
          console.log(response);
          if(response['success']== true) {
            this.addList.emit(this.newList);
            this.newList.title = '';
            this.newList.description = '';
            this._snackBar.open('Added successfully !', '', {
              duration: 2000,
            });
          }
               
        },
    );

    }
}
