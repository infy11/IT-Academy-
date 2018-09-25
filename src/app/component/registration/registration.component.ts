import { Component, OnInit } from '@angular/core';
import {Course} from '../../course';
import {Student} from '../../student';
import {Education } from '../../education';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  
  state:String[]=['UTTRAKHAND','UTTRAPRADESH'];
  gender:String[]=['MALE','FEMALE'];
  category:String[]=['UR','OBC','SC','ST'];
  defaultCategory:string=null;
  course:Course=new Course('','','','','');
  educationDetails:Education[]=[];
  highschool=new Education('highschool','','','','');
  intermediate=new Education('intermediate','','','','');
  graduation=new Education('graduation','','','','');
  others=new Education('others','','','','');


  student:Student=new Student('','','category','gender','','','','','','','','state',this.course,this.educationDetails);
 onSubmit(){
   this.educationDetails.push(this.highschool);
   this.educationDetails.push(this.intermediate);
   this.educationDetails.push(this.graduation);
   this.educationDetails.push(this.others);

   console.log(JSON.stringify(this.student));
   

 }

  constructor() { 

  }

  ngOnInit() {

    
  }

}
