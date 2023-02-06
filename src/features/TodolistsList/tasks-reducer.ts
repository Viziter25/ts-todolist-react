import {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,
} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: TasksStateType = {}


const slice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index > -1) {
        tasks.splice(index, 1)
      }
    },
    addTaskAC(state, action: PayloadAction<TaskType>) {
      state[action.payload.todoListId].unshift(action.payload)
    },
    updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index > -1) {
        tasks[index] = {...tasks[index], ...action.payload.model}
      }
    },
    setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
      state[action.payload.todolistId] = action.payload.tasks
    },
    changeTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, id: string, status: RequestStatusType }>) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.id)
      if (index > -1) {
        tasks[index].entityStatus = action.payload.status
      }
    },
    clearDataAC(state, action: PayloadAction) {
      return state = {}
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach(tl => {
        state[tl.id] = []
      })
    })
  }
})


export const tasksReducer = slice.reducer
export const {removeTaskAC, addTaskAC, updateTaskAC, changeTaskEntityStatusAC, setTasksAC, clearDataAC} = slice.actions


// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.getTasks(todolistId)
    .then((res) => {
      dispatch(setTasksAC({tasks: res.data.items, todolistId: todolistId}))
      dispatch(setAppStatusAC({status: 'succeeded'}))
    })
}


export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  dispatch(changeTaskEntityStatusAC({todolistId: todolistId, id: taskId, status: 'loading'}))
  todolistsAPI.deleteTask(todolistId, taskId)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.OK) {
        dispatch(removeTaskAC({taskId: taskId, todolistId: todolistId}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}


export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.createTask(todolistId, title)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.OK) {
        dispatch(addTaskAC( res.data.data.item))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn('task not found in the state')
      return
    }
    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel
    }

    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.updateTask(todolistId, taskId, apiModel)
      .then(res => {
        if (res.data.resultCode === RESULT_CODE.OK) {
          dispatch(updateTaskAC({taskId: taskId, model: domainModel, todolistId: todolistId}))
          dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch)
      })
  }


export enum RESULT_CODE {
  OK = 0,
  ERROR = 1,
  CAPTCHA = 10
}

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}

export type SetTasksACActionType = ReturnType<typeof setTasksAC>;
export type ClearDataActionType = ReturnType<typeof clearDataAC>

