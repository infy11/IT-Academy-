import { Component, OnInit } from '@angular/core';
import {Marks} from '../marks';
import {MarksWrapper} from '../marks-wrapper';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.css']
})
export class MarksComponent implements OnInit {

  sem1:Marks=new Marks('semester1','','','');
  sem2:Marks=new Marks('semester2','','','');
  
  marks:MarksWrapper=new MarksWrapper('',[this.sem1,this.sem2]);

  constructor() {
    
   }

   save(){
     console.log(JSON.stringify(this.marks));
   }

  ngOnInit() {
  }

}
