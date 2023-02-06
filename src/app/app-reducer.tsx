import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const initialState = {
  status: 'loading' as RequestStatusType,
  error: null as null | string,
  isInitialized: false,
}


const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppErrorAC: (state, action: PayloadAction<{ error: null | string }>) => {
      state.error = action.payload.error
    },
    setInitializedAC: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    }
  }
})

export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC, setInitializedAC} = slice.actions



// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case 'APP/SET-STATUS':
//       return {...state, status: action.status}
//     case 'APP/SET-ERROR':
//       return {...state, error: action.error}
//     case 'APP/SET-INITIALIZED':
//       return {...state, isInitialized: action.value}
//     default:
//       return state
//   }
// }


// export const setAppStatusAC = (status:RequestStatusType) => {
//   return {type: 'APP/SET-STATUS', status} as const
// }
// export const setAppErrorAC = (error: null | string) => {
//   return {type: 'APP/SET-ERROR', error} as const
// }
// export const setInitializedAC = (value: boolean) =>
//   ({type: 'APP/SET-INITIALIZED', value} as const)

// export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
// export type setAppErrorACType = ReturnType<typeof setAppErrorAC>
// export type setInitializedActionType = ReturnType<typeof setInitializedAC>

// type ActionsType = setAppStatusACType | setAppErrorACType | setInitializedActionType
