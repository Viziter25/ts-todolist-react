import {FilterValuesType, TodolistsType} from '../../App';
import {v1} from 'uuid';


type ActionType = removeTodolistACType | addTodolistACType | changeTodolistTitleAC | changeTodolistFilterACType

const initialState: Array<TodolistsType> = []

export const todolistsReducer = (state = initialState, action: ActionType): Array<TodolistsType> => {
  switch (action.type) {
    case'REMOVE_TODOLIST': {
      return state.filter(t => t.id !== action.id)
    }
    case 'ADD-TODOLIST' : {
      return [...state, {id:action.payload.todoId, title:action.payload.newTitle, filter: 'all'}]
    }
    case 'CHANGE-TODOLIST-TITLE': {
      return state.map(t => t.id === action.payload.todoId ? {...t, title: action.payload.newTitle}: t)
    }
    case 'CHANGE-TODOLIST-FILTER' : {
      return state.map(t => t.id === action.payload.todoId ? {...t, filter: action.payload.value}: t)
    }
    default:
      return state
  }
}

export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (todoId: string) => {
  return {
    type: 'REMOVE_TODOLIST',
    id: todoId
  }as const
}

export type addTodolistACType = ReturnType<typeof addTodolistAC>
export const addTodolistAC = (newTitle: string) => {
  return {
    type: 'ADD-TODOLIST',
    payload: {
      todoId: v1(),
      newTitle: newTitle
    }
  }as const
}

type changeTodolistTitleAC = ReturnType<typeof changeTodolistTitleAC>
export const changeTodolistTitleAC = (todoId: string, newTitle: string) => {
  return {
    type: 'CHANGE-TODOLIST-TITLE',
    payload: {
      todoId:todoId,
      newTitle:newTitle
    }
  }as const
}

type changeTodolistFilterACType = ReturnType<typeof changeTodolistFilterAC>
export const changeTodolistFilterAC = (todoId: string, value: FilterValuesType) => {
  return {
    type: 'CHANGE-TODOLIST-FILTER',
    payload: {
      todoId:todoId,
      value: value
    }
  }as const
}