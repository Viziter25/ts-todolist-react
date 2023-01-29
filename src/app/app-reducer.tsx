export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
  status: 'loading' as RequestStatusType,
  error:  null as null | string,
  isInitialized: false,
}

type InitialStateType = typeof initialState


export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return {...state, status: action.status}
    case 'APP/SET-ERROR':
      return {...state, error: action.error}
    case 'APP/SET-INITIALIZED':
      return {...state, isInitialized: action.value}
    default:
      return state
  }
}


export const setAppStatusAC = (status:RequestStatusType) => {
  return {type: 'APP/SET-STATUS', status} as const
}
export const setAppErrorAC = (error: null | string) => {
  return {type: 'APP/SET-ERROR', error} as const
}
export const setInitializedAC = (value: boolean) =>
  ({type: 'APP/SET-INITIALIZED', value} as const)

export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>
export type setInitializedActionType = ReturnType<typeof setInitializedAC>

type ActionsType = setAppStatusACType | setAppErrorACType | setInitializedActionType
