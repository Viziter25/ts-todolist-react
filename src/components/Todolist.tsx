import React, {ChangeEvent} from 'react';
import s from './Todolist.module.css'
import {AddItemForm} from './AddItemForm/AddItemForm';
import {EditableSpan} from './EditebleSpan/EtitableSpan';
import {Button, IconButton} from '@mui/material';
import {Delete} from '@mui/icons-material';

type FilterValuesType = 'all' | 'active' | 'completed';

type TodolistPropsType = {
  id: string
  title: string
  tasks: TaskType[]
  filter: FilterValuesType

  removeTodolist: (todoId: string) => void
  removeTasks: (todoId: string, taskId: string) => void
  addTasks: (todoId: string, newTitle: string) => void
  changeFilter: (todoId: string, value: FilterValuesType) => void
  onChangeStatus: (todoId: string, taskId: string, isDone: boolean) => void
  changeTitleTask: (todoId: string, taskId: string, newTitle: string) => void
  changeTitleTodolist: (todoId: string, newTitle: string) => void
}

type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {
  const {id} = props


  const removeTodolistHandler = () => {
    props.removeTodolist(id)
  }

  const removeTasksHandler = (taskId: string) => {
    props.removeTasks(id, taskId)
  }

  const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
    props.onChangeStatus(id, taskId, e.currentTarget.checked)
  }

  const changeFilterAllHandler = () => {
    props.changeFilter(id, 'all')
  }
  const changeFilterActiveHandler = () => {
    props.changeFilter(id, 'active')
  }
  const changeFilterCompletedHandler = () => {
    props.changeFilter(id, 'completed')
  }

  const addTaskHandler = (title: string) => {
    props.addTasks(id, title)
  }

  const changeTitleTodolistHandler = (title: string) => {
    props.changeTitleTodolist(id, title)
  }


  return (
    <div>
        <span className={s.titleTasks}>
          <EditableSpan title={props.title} changeTitle={changeTitleTodolistHandler}/>
          <IconButton aria-label="delete" size="small" onClick={removeTodolistHandler}>
            <Delete fontSize="small"/>
          </IconButton>
          {/*<button onClick={removeTodolistHandler}>x</button>*/}
        </span>


      <ul className={s.ul}>
        <AddItemForm addItem={addTaskHandler}/>

        {
          props.tasks.map(el => {

            const changeTitleTaskHandler = (newTitle: string) => {
              props.changeTitleTask(id, el.id, newTitle)
            }

            return (
              <li key={el.id} className={s.task}>
                <input type="checkbox"
                       onChange={(e) => onChangeStatusHandler(e, el.id)}
                       checked={el.isDone}/>
                <EditableSpan title={el.title} changeTitle={changeTitleTaskHandler}/>
                <IconButton aria-label="delete" size="small" onClick={() => {
                  removeTasksHandler(el.id)
                }}>
                  <Delete fontSize="inherit"/>
                </IconButton>
                {/*<button onClick={() => {removeTasksHandler(el.id)}}>х</button>*/}
              </li>
            )
          })
        }
      </ul>
      {

      }
      {/*const classNameForAll = {props.filter === 'all' ? s.activeFilter : ''}*/}
      {/*const classNameForActive = {props.filter === 'active' ? s.activeFilter : ''}*/}
      {/*const classNameForCompleted = {props.filter === 'completed' ? s.activeFilter : ''}*/}

      <div>
        <Button variant="outlined" size="small" onClick={changeFilterAllHandler} className={props.filter === 'all' ? s.activeFilter : s.button}>All</Button>
        <Button variant="outlined" size="small"  onClick={changeFilterActiveHandler} className={props.filter === 'active' ? s.activeFilter : s.button}>Active</Button>
        <Button variant="outlined" size="small"  onClick={changeFilterCompletedHandler} className={props.filter === 'completed' ? s.activeFilter : s.button}>Completed</Button>

        {/*<button onClick={changeFilterAllHandler} className={props.filter === 'all' ? s.activeFilter : ''}>All</button>*/}
        {/*<button onClick={changeFilterActiveHandler} className={props.filter === 'active' ? s.activeFilter : ''}>Active*/}
        {/*</button>*/}
        {/*<button onClick={changeFilterCompletedHandler}*/}
        {/*        className={props.filter === 'completed' ? s.activeFilter : ''}>Completed*/}
        {/*</button>*/}
      </div>

    </div>
  );
};
