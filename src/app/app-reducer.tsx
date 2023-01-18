export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
  status: 'loading' as RequestStatusType,
  error:  null
}

type InitialStateType = {
  status: RequestStatusType
  error: string | null
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return {...state, status: action.status}
    case 'APP/SET-ERROR':
      return {...state, error: action.error}
    default:
      return state
  }
}


export const setAppStatusAC = (status:RequestStatusType) => {
  return {type: 'APP/SET-STATUS', status} as const
}
export const setAppErrorAC = (error:any) => {
  return {type: 'APP/SET-ERROR', error} as const
}

export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>

type ActionsType = setAppStatusACType | setAppErrorACType
