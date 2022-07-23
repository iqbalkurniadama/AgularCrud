import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms'
import { ApiService } from '../shared/api.service';
import { EmployeeModel } from './employee-dashboard.model';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  formValue !: FormGroup
  employeeModelObj : EmployeeModel = new EmployeeModel()
  employeeData !: any
  showAdd !: boolean
  showUpdate !: boolean
  constructor(private formbuilder: FormBuilder,
    private api : ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      fullName : [' '],
      email : [' '],
      mobile : [' '],
      salary : [' '],
    })
    this.getAllEmployee()
  }

  clickAddEmployee(){
    this.formValue.reset()
    this.showAdd = true
    this.showUpdate = false
  }

  postEmployeeDetails(){
    this.employeeModelObj.fullName = this.formValue.value.fullName
    this.employeeModelObj.email = this.formValue.value.email
    this.employeeModelObj.mobile = this.formValue.value.mobile
    this.employeeModelObj.salary = this.formValue.value.salary
    
    this.api.postEmployee(this.employeeModelObj)
    .subscribe({
      next : (res)=>{
        console.log(res); 
        alert("Employee Added Succesfully")
        let ref = document.getElementById('cancel')
        ref?.click()
        this.formValue.reset()
        this.getAllEmployee()
      }, error : (err)=> {
        alert("Something Went Wrong!!")
      }
    })
  }

  getAllEmployee(){
    this.api.getEmployee()
    .subscribe({next: (res) => {
      this.employeeData = res
    }})
  }

  deleteEmployee(row:any){
    let clickYes = confirm("Are you sure want to delete")
    if(clickYes){
      this.api.deleteEmployee(row.id)
      .subscribe({
        next : (res) => {
          alert('Deleted Successfully')
          this.getAllEmployee()
        }
      })
    }
  }

  onEdit(row:any){
    this.showAdd = false
    this.showUpdate = true
    this.employeeModelObj.id = row.id
    this.formValue.controls['fullName'].setValue(row.fullName)
    this.formValue.controls['email'].setValue(row.email)
    this.formValue.controls['mobile'].setValue(row.mobile)
    this.formValue.controls['salary'].setValue(row.salary)
  }

  updateEmployeeDetails(){
    this.employeeModelObj.fullName = this.formValue.value.fullName
    this.employeeModelObj.email = this.formValue.value.email
    this.employeeModelObj.mobile = this.formValue.value.mobile
    this.employeeModelObj.salary = this.formValue.value.salary

    this.api.updateEmployee(this.employeeModelObj, this.employeeModelObj.id)
    .subscribe({
      next : (res) =>{
        alert("Updated Successfully")
        let ref = document.getElementById('cancel')
        ref?.click()
        this.formValue.reset()
        this.getAllEmployee()
      }
    })
  }


}
