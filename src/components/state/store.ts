import {tasksReducer} from './task-reducer';
import {todolistsReducer} from './todolists-reducer';
import {combineReducers, legacy_createStore} from 'redux';


const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer
})


// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export const store =  legacy_createStore(rootReducer);

