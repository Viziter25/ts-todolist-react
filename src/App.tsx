import React, {useState} from 'react';
import './App.css';
import {v1} from 'uuid';
import {Todolist} from './components/Todolist';

function App() {

 type FilterValuesType = 'all' | 'active' | 'completed';

  type TodolistsType = {
    id:string
    title:string
    filter:FilterValuesType
  }
  type TaskStateType = {
    [key:string] : TaskType[]
  }
  type TaskType = {
    id: string
    title: string
    isDone: boolean
  }


  let todolistId1 = v1()
  let todolistId2 = v1()


  let [todolists, setTodolists] = useState<Array<TodolistsType>>([
      {id: todolistId1, title: 'What to learn', filter: 'all'},
      {id: todolistId2, title: 'What to buy', filter: 'completed'},
    ]
  )

  let [tasks, setTasks] = useState<TaskStateType>({
    [todolistId1]: [
      {id: v1(), title: 'HTML&CSS', isDone: true},
      {id: v1(), title: 'JS', isDone: true},
      {id: v1(), title: 'ReactJS', isDone: false},
      {id: v1(), title: 'Rest API', isDone: false},
      {id: v1(), title: 'GraphQL', isDone: false},
    ],
    [todolistId2]: [
      {id: v1(), title: 'Milk', isDone: true},
      {id: v1(), title: 'Bread', isDone: false},
    ]
  })

  const removeTodolist = (todoId:string) => {
    setTodolists(todolists.filter(tl => tl.id !== todoId))
  }
  const removeTasks = (todoId:string, taskId:string) => {
    setTasks({...tasks, [todoId]: tasks[todoId].filter(t => t.id !== taskId)})
  }
  const addTasks = (todoId:string, newTitle:string) =>{
    const newTask = {id: v1(), title:newTitle, isDone: false}
    setTasks({...tasks, [todoId]: [newTask,...tasks[todoId]]})
  }

  const changeFilter = (todoId:string, value:FilterValuesType) => {
    let todolist = todolists.find(tl => tl.id === todoId);
    if (todolist) {
      todolist.filter = value
      setTodolists([...todolists,])
    }
  }

  const onChangeStatus = (todoId:string, taskId:string, isDone:boolean) => {
    setTasks({...tasks, [todoId] : tasks[todoId].map(t => t.id === taskId ? {...t, isDone:isDone} : t)})
  }




  return (
    <div className="App">

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
          />
        })
      }


    </div>
  );
}

export default App;
