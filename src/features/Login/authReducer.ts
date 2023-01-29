import {Dispatch} from 'redux';
import {setAppStatusAC, setInitializedAC} from '../../app/app-reducer';
import {authAPI, LoginParamsType} from '../../api/todolists-api';
import {clearDataAC, RESULT_CODE} from '../TodolistsList/tasks-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';

const initialState = {
  isLoggedIn: false
}

type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionType):InitialStateType => {
  switch (action.type) {
    case 'login/SET-IS-LOGGED-IN' : {
      return {...state, isLoggedIn: action.value}
    }
    default:
      return state
  }
}

//action
export const setIsLoggedInAC = (value: boolean) =>
  ({ type: 'login/SET-IS-LOGGED-IN', value } as const)


//thunk
export const loginTC = (data:LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  authAPI.login(data)
    .then(res => {
      if (res.data.resultCode ===  RESULT_CODE.OK) {
        dispatch(setIsLoggedInAC(true))
        dispatch(setAppStatusAC('succeeded'))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}


export const initializeAppTC = () => async (dispatch:Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  try {
    const res = await authAPI.me()
    if( res.data.resultCode === RESULT_CODE.OK) {
      dispatch(setIsLoggedInAC(true))
      dispatch(setAppStatusAC('succeeded'))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  }
  catch (error) {
    // @ts-ignore
    handleServerNetworkError(error, dispatch)
  }
  finally {
    dispatch(setInitializedAC(true))
  }
}


export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  authAPI.logout()
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.OK) {
        dispatch(setIsLoggedInAC(false))
        dispatch(setAppStatusAC('succeeded'))
        dispatch(clearDataAC())
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}

type setIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>
type ActionType = setIsLoggedInACType