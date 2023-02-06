import {Dispatch} from 'redux';
import {setAppStatusAC, setInitializedAC} from '../../app/app-reducer';
import {authAPI, LoginParamsType} from '../../api/todolists-api';
import {clearDataAC, RESULT_CODE} from '../TodolistsList/tasks-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false
}


const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    }
  }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

// const setIsLoggedInAC = slice.actions.setIsLoggedInAC
// export const authReducer = (state: InitialStateType = initialState, action: ActionType):InitialStateType => {
//   switch (action.type) {
//     case 'login/SET-IS-LOGGED-IN' : {
//       return {...state, isLoggedIn: action.value}
//     }
//     default:
//       return state
//   }
// }

//action
// export const setIsLoggedInAC = (value: boolean) =>
//   ({type: 'login/SET-IS-LOGGED-IN', value} as const)
//

//thunk
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  authAPI.login(data)
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.OK) {
        dispatch(setIsLoggedInAC({value: true}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}


export const initializeAppTC = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === RESULT_CODE.OK) {
      dispatch(setIsLoggedInAC({value: true}))
      dispatch(setAppStatusAC({status: 'succeeded'}))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (error) {
    // @ts-ignore
    handleServerNetworkError(error, dispatch)
  } finally {
    dispatch(setInitializedAC({isInitialized:true}))
  }
}


export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  authAPI.logout()
    .then(res => {
      if (res.data.resultCode === RESULT_CODE.OK) {
        dispatch(setIsLoggedInAC({value: false}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
        dispatch(clearDataAC())
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch)
    })
}
