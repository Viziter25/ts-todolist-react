import React, {ChangeEvent} from 'react';
import s from './Todolist.module.css'
import {AddItemForm} from './AddItemForm/AddItemForm';
import {EditableSpan} from './EditebleSpan/EtitableSpan';

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
  onChangeStatus:(todoId: string, taskId: string, isDone:boolean) => void
  changeTitleTask:(todoId: string, taskId: string, newTitle:string) => void
  changeTitleTodolist:(todoId:string, newTitle:string) => void
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

  const onChangeStatusHandler = (e:ChangeEvent<HTMLInputElement>,taskId:string ) => {
    props.onChangeStatus(id, taskId, e.currentTarget.checked)
  }

  const changeFilterAllHandler = () => {
    props.changeFilter(id,'all')
  }
  const changeFilterActiveHandler = () => {
    props.changeFilter(id,'active')
  }
  const changeFilterCompletedHandler = () => {
    props.changeFilter(id,'completed')
  }

  const addTaskHandler = (title:string) => {
    props.addTasks(id, title)
  }

  const changeTitleTodolistHandler = (title: string) => {
    props.changeTitleTodolist(id, title)
  }


    return(
    <div>
        <span>
          <EditableSpan title={props.title} changeTitle={changeTitleTodolistHandler}/>
          <button onClick={removeTodolistHandler}>x</button>
        </span>


      <ul className={s.ul}>
        <AddItemForm addItem={addTaskHandler} />

        {
          props.tasks.map(el => {

            const changeTitleTaskHandler = (newTitle: string) => {
              props.changeTitleTask(id, el.id, newTitle)
            }

            return (
              <li key={el.id}>
                <input type="checkbox"
                       onChange={(e)=>onChangeStatusHandler(e,el.id)}
                       checked={el.isDone}/>
                <EditableSpan title={el.title} changeTitle={changeTitleTaskHandler}/>
                <button onClick={() => {removeTasksHandler(el.id)}}>х</button>
              </li>
            )
          })
        }
      </ul>{

    }
      {/*const classNameForAll = {props.filter === 'all' ? s.activeFilter : ''}*/}
      {/*const classNameForActive = {props.filter === 'active' ? s.activeFilter : ''}*/}
      {/*const classNameForCompleted = {props.filter === 'completed' ? s.activeFilter : ''}*/}

      <div>
        <button onClick={changeFilterAllHandler} className={props.filter === 'all' ? s.activeFilter : ''}>All</button>
        <button onClick={changeFilterActiveHandler} className={props.filter === 'active' ? s.activeFilter : ''}>Active</button>
        <button onClick={changeFilterCompletedHandler} className={props.filter === 'completed' ? s.activeFilter : ''}>Completed</button>
      </div>

    </div>
  );
};
