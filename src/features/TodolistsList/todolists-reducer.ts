import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {
  RequestStatusType,
  setAppStatusAC,
} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import axios from 'axios';
import {ClearDataActionType, fetchTasksTC, RESULT_CODE, SetTasksACActionType} from './tasks-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
  name: 'todolists',
  initialState: initialState,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index > -1) {
        state.splice(index,1)
      }
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].title = action.payload.title
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
      return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId)
      state[index].entityStatus = action.payload.status
    },
  }
})

export const todolistsReducer = slice.reducer
export const {
  removeTodolistAC,
  addTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  setTodolistsAC,
  changeTodolistEntityStatusAC
} = slice.actions

// export const todolistsReducer2 = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
//   switch (action.type) {
//     case 'REMOVE-TODOLIST':
//       return state.filter(tl => tl.id !== action.id)
//     case 'ADD-TODOLIST':
//       return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
//     case 'CHANGE-TODOLIST-TITLE':
//       return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
//     case 'CHANGE-TODOLIST-FILTER':
//       return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
//     case 'SET-TODOLISTS':
//       return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
//     case 'CHANGE-TODOLIST-ENTITY-STATUS' :
//       return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.status} : tl)
//     case 'CLEAR-DATA':
//       return []
//     default:
//       return state
//   }
// }

// actions
// export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
// export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
// export const changeTodolistTitleAC = (id: string, title: string) => ({
//   type: 'CHANGE-TODOLIST-TITLE', id, title
// } as const)
// export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
//   type: 'CHANGE-TODOLIST-FILTER', id, filter
// } as const)
// export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
// export const changeTodolistEntityStatusAC = (todolistId: string, status: RequestStatusType) => ({
//   type: 'CHANGE-TODOLIST-ENTITY-STATUS', todolistId, status
// } as const)


// thunks
export const fetchTodolistsTC = () => (dispatch: any) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.getTodolists()
    .then((res) => {
      dispatch(setTodolistsAC({todolists: res.data}))
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return res.data
    })
    .then(todos => {
      todos.forEach(tl => {
        dispatch(fetchTasksTC(tl.id))
      })
    })
}
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todolistId: todolistId, status: 'loading'}))

    todolistsAPI.deleteTodolist(todolistId)
      .then((res) => {
        if (res.data.resultCode === RESULT_CODE.OK) {
          dispatch(removeTodolistAC({id: todolistId}))
          dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch)
        dispatch(changeTodolistEntityStatusAC({todolistId: todolistId, status: 'failed'}))

      })
  }
}

export const addTodolistTC = (title: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))

  try {
    const res = await todolistsAPI.createTodolist(title)
    if (res.data.resultCode === RESULT_CODE.OK) {
      dispatch(addTodolistAC({todolist: res.data.data.item}))
      dispatch(setAppStatusAC({status: 'succeeded'}))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleServerNetworkError(error, dispatch)
    }
  }
}


export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.updateTodolist(id, title)
      .then((res) => {
        if (res.data.resultCode === RESULT_CODE.OK) {
          dispatch(changeTodolistTitleAC({id: id, title: title}))
          dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch)
      })
  }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type changeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>;
type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodolistsActionType
  | changeTodolistEntityStatusActionType
  | SetTasksACActionType
  | ClearDataActionType
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
