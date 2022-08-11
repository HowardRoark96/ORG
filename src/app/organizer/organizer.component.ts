import { Component, OnInit } from '@angular/core';
import { DateService } from "../shared/date.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Task, TasksService } from "../shared/tasks.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  form: FormGroup;
  tasks: Task[] = [];

  constructor(
    public dateService: DateService,
    private tasksService: TasksService

  ) { }

  ngOnInit(): void {
    this.dateService.date
      .pipe(
        switchMap(value => this.tasksService.loadTasks(value))
      ).subscribe(
        tasks => this.tasks = tasks
    );

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  submit() {
    const { title } = this.form.value;
    const task: Task = {
      title,
      isDone: false,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };

    this.tasksService.create(task).subscribe(
      task => {
        this.tasks.push(task);
        this.form.reset();
      },
        error => console.error(`Error: ${error}`)
    );
  }

  doneTask(task: Task) {
    task.isDone = !task.isDone;

    this.tasksService.done(task)
      .subscribe(
        () => {},
        error => console.error(error)
      );
  }

  removeTask(task: Task) {
    this.tasksService.remove(task)
      .subscribe(
        () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id)
        },
        error => console.error(error)
      );
  }
}
