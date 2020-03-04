import { Component, OnInit, Inject, EventEmitter, Output, ViewChild } from '@angular/core';
import { List } from '../models/list';
import { ToDoServiceService } from '../to-do-service.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';

const ELEMENT_DATA: List[] = [];

@Component({
  selector: 'app-view-list-component',
  templateUrl: './view-list-component.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./view-list-component.component.css']
})
export class ViewListComponentComponent implements OnInit {
  // dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource<List>(ELEMENT_DATA);
  columnsToDisplay = ['title', 'action'];
  expandedElement: List | null;
  //lists propoerty which is an array of List type
  private lists: List[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private listServ: ToDoServiceService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('datasource', this.dataSource);
    
    //Load all list on init
    this.loadLists();
    this.dataSource.paginator = this.paginator;
  }

  public loadLists() {

    //Get all lists from server and update the lists property
    this.listServ.getAllLists().subscribe(
        response => {
          console.log('..', response);
          
          this.dataSource = new MatTableDataSource(response['lists']);
          this.dataSource.paginator = this.paginator;
          console.log('datasource', this.dataSource);
        });
  }

  //deleteList. The deleted list is being filtered out using the .filter method
  public deleteList(list: List) {
    console.log(list);
    
    this.listServ.deleteList(list._id).subscribe(
      response =>    {
        this.lists = this.lists.filter(lists => lists !== list);
        this._snackBar.open('Deleted successfully !', '', {
          duration: 2000,
        });
        this.loadLists();
      })
    }

  public onAddList(newList) {
      this.lists = this.lists.concat(newList);
      this.loadLists();
  }

  public editList(element): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '350px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadLists();
      // this.animal = result;
    });
  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<div class="p-4"><h1 mat-dialog-title>UPDATE LIST</h1>
  <form (ngSubmit)="onSubmit()">
  <div>
    <mat-form-field appearance="outline">
    <mat-label>Title</mat-label>
    <input matInput placeholder="Title" [(ngModel)]="newList.title" name="title">
    <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
    </mat-form-field>
  </div>

  <div>
    <mat-form-field appearance="outline">
    <mat-label>Description</mat-label>
    <input matInput placeholder="Description" [(ngModel)]="newList.description" name="description">
    <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
    </mat-form-field>
  </div>

  <button mat-flat-button color="primary" type="submit">Submit</button>

</form>
</div>`,
})
export class DialogOverviewExampleDialog {

  private newList :List;
  @Output() addList: EventEmitter<List> = new EventEmitter<List>();

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: List, private listServ: ToDoServiceService, private _snackBar: MatSnackBar) {
      console.log(data);
      
      this.newList = {
        title: data.title,
        description: data.description,
        _id: data._id

      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public onSubmit() {
    this.listServ.updateList(this.newList._id, this.newList).subscribe(
        response=> {
          console.log(response);
          // if(response['success']== true)
                this.addList.emit(this.newList);
                this.dialogRef.close();
                this._snackBar.open('Updated successfully !', '', {
                  duration: 2000,
                });
        },
    );

    }

}
