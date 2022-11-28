import {TaskStateType} from '../../App';
import {addTodolistACType, removeTodolistACType} from './todolists-reducer';
import {v1} from 'uuid';

type ActionType = removeTaskAC | addTaskACType | changeTaskStatusAC | changeTaskTitleACType | addTodolistACType | removeTodolistACType

const initialState: TaskStateType = {}

export const tasksReducer = (state = initialState, action: ActionType): TaskStateType => {
  switch (action.type) {
    case 'REMOVE-TASK' : {
      return {
        ...state,
        [action.payload.todoId]: state[action.payload.todoId].filter(t => t.id !== action.payload.taskId)
      }
    }
    case 'ADD-TASK' : {
      return {
        ...state,
        [action.payload.todoId]: [{id: v1(), title: action.payload.newTitle, isDone: false
        }, ...state[action.payload.todoId]]
      }
    }
    case 'CHANGE-TASK-STATUS': {
      return {...state, [action.payload.todoId]: state[action.payload.todoId].map(t => t.id === action.payload.taskId ? {...t, isDone: action.payload.isDone}:t)}
    }
    case 'CHANGE-TASK-TITLE': {
      return {...state, [action.payload.todoId]: state[action.payload.todoId].map(t => t.id === action.payload.taskId ? {...t, title: action.payload.newTitle}:t)}
    }
    case 'ADD-TODOLIST' : {
      return {...state, [action.payload.todoId]: []}
    }
    case 'REMOVE_TODOLIST' : {
      const stateCopy = {...state}
      delete stateCopy[action.id]
      return stateCopy
    }
    default:
      return state
  }
}

type removeTaskAC = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (taskId: string, todoId: string,) => {
  return {
    type: 'REMOVE-TASK',
    payload: {
      todoId: todoId,
      taskId: taskId
    }
  } as const
}

type addTaskACType = ReturnType<typeof addTaskAC>
export const addTaskAC = (newTitle: string, todoId: string) => {
  return {
    type: 'ADD-TASK',
    payload: {
      todoId,
      newTitle
    }
  } as const
}

type changeTaskStatusAC = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = ( taskId: string, isDone: boolean, todoId: string,) => {
  return {
    type: 'CHANGE-TASK-STATUS',
    payload: {
      todoId,
      taskId,
      isDone
    }
  }as const
}

type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
export const changeTaskTitleAC = ( taskId: string, newTitle: string,  todoId: string) => {
  return {
    type: 'CHANGE-TASK-TITLE',
    payload: {
      taskId,
      newTitle,
      todoId
    }
  }as const
}

