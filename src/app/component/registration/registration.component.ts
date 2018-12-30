import { Component, OnInit } from '@angular/core';
import {Course} from '../../course';
import {Student} from '../../student';
import {Education } from '../../education';
import { StudentService} from '../../student.service';
import swal from 'sweetalert'
import * as  AWS from 'aws-sdk';
import { RegistrationNo } from 'src/app/registration-no';





@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  fileName:String="upload file"
  minDate = {year: 1970, month: 1, day: 1};
  isClicked=false;
  state:String[]=['UTTRAKHAND','UTTRAPRADESH'];
  gender:String[]=['MALE','FEMALE'];
  category:String[]=['UR','OBC','SC','ST'];
  defaultCategory:string=null;
  course:Course=new Course('','','','');
  educationDetails:Array<Education>=[];
  highschool=new Education('highschool','','','','');
  intermediate=new Education('intermediate','','','','');
  graduation=new Education('graduation','','','','');
  others=new Education('others','','','','');
  RegistrationNo:String ="";


  student:Student=new Student(this.RegistrationNo,'','','category','gender','','','','','','','','state','',this.course,this.educationDetails);
 onSubmit(){
   this.isClicked=true;

   this.educationDetails.push(this.highschool);
   this.educationDetails.push(this.intermediate);
   this.educationDetails.push(this.graduation);
   this.educationDetails.push(this.others);
   console.log(JSON.stringify(this.student));
   this.educationDetails=[];
 
   this.studentService.saveStudent(this.student).subscribe(
    res=>{
      if(res)
      {
         console.log(res);
        
      }
    },
    err=>{console.log(err)
      swal({
        title: "Error",
        text: "An error occured",
        icon: "error",

      });
      this.isClicked=false;
    
    },

    ()=>{
      swal({
        title: "Success",
        text: "Student Saved Successfully",
        icon: "success",

      });
      this.isClicked=false;
    }
    
    
  )

   

 }

 fileUpload(fileInput:any){
   console.log("file upload called");
   
  const target_file = fileInput.target.files[0];
  this.fileName=fileInput.target.files[0].name;

  const buckerName='it-academy-photos-bucket';


  AWS.config.region = 'us-east-1'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "us-east-1:9f1aedc7-a078-4541-ae72-8366dbaf3c12",
  }); 
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: buckerName}
  });

  s3.upload(
    { Key: this.student.regNo.toString(), Bucket: buckerName, Body: target_file, ACL: 'public-read'}
  ,(err,data)=>{
    if(data)
    {
      console.log(data);
      this.student.photo=data.Location;
    }
    else{
      console.log(err);
    }

  })
 

};


 

  constructor(private studentService:StudentService) { 
    this.studentService.generateRegistrationNo().subscribe(
      regNo=>{
       
        
        this.RegistrationNo=regNo.regNo.toString();
        this.student.regNo=this.RegistrationNo;
        
        


      }
    );

  }

  ngOnInit() {

    
  }

}
