import React, {ChangeEvent, useState} from 'react';
import s from './Todolist.module.css'

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
}

type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {

  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const removeTodolistHandler = () => {
    props.removeTodolist(props.id)
  }

  const removeTasksHandler = (taskId: string) => {
    props.removeTasks(props.id, taskId)
  }
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
    setError(null)
  }

  const addTasksHandler = () => {
    if (title.trim() !== '') {
      props.addTasks(props.id, title)
      setTitle('')

    } else {
      setError('Title is required')
    }
  }

  const onChangeStatusHandler = (e:ChangeEvent<HTMLInputElement>,taskId:string ) => {
    props.onChangeStatus(props.id, taskId, e.currentTarget.checked)
  }

  const changeFilterAllHandler = () => {
    props.changeFilter(props.id,'all')
  }
  const changeFilterActiveHandler = () => {
    props.changeFilter(props.id,'active')
  }
  const changeFilterCompletedHandler = () => {
    props.changeFilter(props.id,'completed')
  }


    return(
    <div>
        <span>
          {props.title}
          <button onClick={removeTodolistHandler}>x</button>
        </span>


      <ul className={s.ul}>
        <input value={title} type="text" onChange={onChangeHandler} className={error ? s.error : ''}/>
        <button onClick={addTasksHandler}>+</button>
        {error && <div className={s.errorMessage}>{error}</div>}
        {
          props.tasks.map(el => {
            return (
              <li key={el.id}>
                <input type="checkbox" onChange={(e)=>onChangeStatusHandler(e,el.id)} checked={el.isDone}/>
                {el.title}
                <button onClick={() => {
                  removeTasksHandler(el.id)
                }}>х
                </button>
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
