import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../Services/user.service';
import { TaskService } from '../../Services/task.service';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {




  tasks: any[] = [];
  users: any[] = [];
  filteredTasks: any[] = [];
  displayedColumns = ['title', 'status', 'user'];
  form!: FormGroup;
  loading = false;

  statuses = ['Pending', 'InProgress', 'Completed'];
  selectedStatus = '';

  constructor(private fb: FormBuilder, private taskService: TaskService, private userService: UserService, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.initForm();
    this.loadTasks();
    this.loadUsers();
  }

  initForm()
  {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }

  loadTasks()
  {
    this.loading = true;
    this.taskService.getAll().subscribe({
      next: data => {
        this.tasks = data;
        this.filteredTasks = data;
        this.loading = false;
      },
      error: () => this.showError('Error loading tasks')
    });
  }

  loadUsers()
  {
    this.userService.getAll().subscribe({
      next: data => this.users = data,
      error: () => this.showError('Error loading users')
    });
  }

  filterByStatus()
  {
    if (!this.selectedStatus) {
      this.filteredTasks = this.tasks;
      return;
    }
    this.filteredTasks = this.tasks.filter(
      c => c.status === this.selectedStatus
    );
  }

  createTask()
  {
    if (this.form.invalid) return;
    this.taskService.create(this.form.value).subscribe({
      next: () => {
        this.snack.open('Task created', 'OK', { duration: 3000 });
        this.form.reset();
        this.loadTasks();
      },
      error: () => this.showError('Error creating task')
    });
  }

  changeStatus(task: any, status: string) {

    const updatedTask = { ...task, status };
    this.taskService.update(task.id, updatedTask).subscribe({
      next: () => { this.snack.open('Status updated', 'OK', { duration: 3000 }); this.loadTasks() },
      error: () => this.showError('Error updating status')
    });
  }

  showError(message: string) {
    this.loading = false;
    this.snack.open(message, 'Close', { duration: 4000 });
  }
}
