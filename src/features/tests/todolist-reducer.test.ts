import {addTodolistAC, TodolistDomainType, todolistsReducer} from '../TodolistsList/todolists-reducer';
import {TodolistType} from '../../api/todolists-api';

let startState:  Array<TodolistDomainType> = [];
beforeEach(() => {
  startState = [
    {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus:'idle'},
    {id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'}
  ]
});


test('correct todolist should be added', ()=> {
   let todolist:TodolistType = {
     title:'New Todolist',
     id: 'any id',
     addedDate:'',
     order:0,
   }

  const endState = todolistsReducer(startState, addTodolistAC(todolist))

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(todolist.title)
  expect(endState[0].filter).toBe('all')
})