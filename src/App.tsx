import React from 'react';
import s from './App.module.css';
import {Todolist} from './components/Todolist';
import {AddItemForm} from './components/AddItemForm/AddItemForm';
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
} from './components/state/task-reducer';
import {
  addTodolistAC,
  changeTodolistFilterAC, changeTodolistTitleAC,
  removeTodolistAC,
} from './components/state/todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './components/state/store';

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistsType = {
  id: string
  title: string
  filter: FilterValuesType
}
export type TaskStateType = {
  [key: string]: TaskType[]
}
type TaskType = {
  id: string
  title: string
  isDone: boolean
}


function App() {


  const todolists = useSelector<AppRootStateType, Array<TodolistsType>>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)

  const dispatch = useDispatch()


  // let [todolists, todolistsDispatch] = useReducer(todolistsReducer,[
  //     // {id: todolistId1, title: 'What to learn', filter: 'all'},
  //     // {id: todolistId2, title: 'What to buy', filter: 'completed'},
  //   ]
  // )

  // let [tasks, taskDispatch] = useReducer(tasksReducer, {
  //   // [todolistId1]: [
  //   //   // {id: v1(), title: 'HTML&CSS', isDone: true},
  //   //   // {id: v1(), title: 'JS', isDone: true},
  //   //   // {id: v1(), title: 'ReactJS', isDone: false},
  //   //   // {id: v1(), title: 'Rest API', isDone: false},
  //   //   // {id: v1(), title: 'GraphQL', isDone: false},
  //   // ],
  //   // [todolistId2]: [
  //   //   // {id: v1(), title: 'Milk', isDone: true},
  //   //   // {id: v1(), title: 'Bread', isDone: false},
  //   // ]
  // })

  const removeTodolist = (todoId: string) => {
    let action = removeTodolistAC(todoId)
    dispatch(action)
  }
  const removeTasks = (todoId: string, taskId: string) => {
    dispatch(removeTaskAC(taskId, todoId))
  }
  const addTasks = (todoId: string, newTitle: string) => {
    dispatch(addTaskAC(newTitle, todoId))
  }

  const changeFilter = (todoId: string, value: FilterValuesType) => {
    dispatch(changeTodolistFilterAC(todoId, value))
  }

  const onChangeStatus = (todoId: string, taskId: string, isDone: boolean) => {
    dispatch(changeTaskStatusAC(taskId, isDone, todoId))
  }

  const addTodolistHandler = (newTitle: string) => {
    let action = addTodolistAC(newTitle)
    dispatch(action)
  }

  const changeTitleTodolist = (todoId: string, newTitle: string) => {
    dispatch(changeTodolistTitleAC(todoId, newTitle))
  }

  const changeTitleTask = (todoId: string, taskId: string, newTitle: string) => {
    dispatch(changeTaskTitleAC(taskId, newTitle, todoId))
  }


  return (
    <div className={s.app}>
      <h3>Add Todolist</h3>
      <AddItemForm addItem={addTodolistHandler}/>
      <div className={s.container}>
        {
          todolists.map(tl => {
            let tasksFiltered = tasks[tl.id]

            if (tl.filter === 'active') {
              tasksFiltered = tasksFiltered.filter(t => !t.isDone)
            }
            if (tl.filter === 'completed') {
              tasksFiltered = tasksFiltered.filter(t => t.isDone)
            }


            return <Todolist key={tl.id}
                             id={tl.id}
                             title={tl.title}
                             tasks={tasksFiltered}
                             filter={tl.filter}

                             removeTodolist={removeTodolist}
                             removeTasks={removeTasks}
                             addTasks={addTasks}
                             changeFilter={changeFilter}
                             onChangeStatus={onChangeStatus}

                             changeTitleTask={changeTitleTask}
                             changeTitleTodolist={changeTitleTodolist}
            />
          })
        }
      </div>


    </div>
  );
}

export default App;
