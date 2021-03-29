import { HttpErrorResponse } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // facem o variabila care va stoca obiectele employees
  public employees: Employee[];

  // salvam intr-o variabila employee pe care il editam
  public editEmployee: Employee;
  // salvam in variabila employee ul care urmeaza sa fie sters (gasit dupa id)
  public deleteEmployee: Employee;

  // injectam service pentru a avea acces la clasa
  constructor(private employeeService: EmployeeService) {}

  // obligatoriu cu implement OnInit trebuie sa adaugam functia ca sa ne cheme functia noastra getEmployees cand se initializeaza componenta asta.

  ngOnInit() {
    this.getEmployees();
  }

  // vrem sa call service
  // facem .subscrice sa fim notificati cand date se intorc de la server
  // pentru a chema functia cand un component este loaded/initializat implementam interfata OnInit in clasa asta (AppComponent)
  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        console.log(this.employees);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void {
    // ca sa se inchida form-ul de add employee dupa ce dam click pe submit
    document.getElementById('add-employee-form').click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        // chemam getEmployee ca sa reincare lista actualizata
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  // cream un nou array unde sa tinem toti employee care contin caracterele din search
  public searchEmployees(key: string): void{
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {
      // loop prin tot array ul de employees (e definit sus), daca key (string) introdus este gasit (rezultatul nu este -1, atunci adauga employee gasiti in noul array (result)), repetem dupa email, telefon job etc
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1 
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    // ca sa anulam rezultatul in caz ca nu avem avem nici un match si sa aducem din nou toti employees
    if(results.length === 0 || !key){
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee, mode: string): void {
    // get acces to the div with the users
    const container = document.getElementById('main-container');
    // create button
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    //check what mode the user is in, vezi functia onOpenModal, adica pe care buton au dat click;
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      // la click pe buton-ul de edit vrem sa modificam employee ul curent
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    // facem ca butonul creat mai sus sa existe in html (DOM)
    container.appendChild(button);
    button.click();
  }
}
