import {
  addTaskAC,
  removeTaskAC,
  setTasksAC,
  tasksReducer,
  TasksStateType,
  updateTaskAC
} from '../TodolistsList/tasks-reducer';
import {TaskPriorities, TaskStatuses} from '../../api/todolists-api';
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from '../TodolistsList/todolists-reducer';


let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    'todolistId1': [
      {
        id: '1',
        title: 'CSS',
        description: '',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: 'todolistId1',
        order: 0,
        addedDate: '',
        entityStatus:'idle'
      },
      {
        id: '2',
        title: 'React',
        description: '',
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: 'todolistId1',
        order: 0,
        addedDate: '',
        entityStatus:'idle'
      },
      {
        id: '3',
        title: 'Redux',
        description: '',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: 'todolistId1',
        order: 0,
        addedDate: '',
        entityStatus:'idle'
      },
    ],
    'todolistId2': [
      {
        id: '1',
        title: 'Bread',
        description: '',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: 'todolistId1',
        order: 0,
        addedDate: '',
        entityStatus:'idle'
      },
      {
        id: '2',
        title: 'milk',
        description: '',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: 'todolistId1',
        order: 0,
        addedDate: '',
        entityStatus:'idle'
      },
      {
        id: '3',
        title: 'tea',
        description: '',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: 'todolistId1',
        order: 0,
        addedDate: '',
        entityStatus:'idle'
      },
    ]
  };
});

test('should be remove correct task of array', () => {
  const action = removeTaskAC('2', 'todolistId2')

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId2'].length).toBe(2)
  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].every(t => t.id != '2')).toBeTruthy()
})

test('should be changed correct title task', () => {
  const action = updateTaskAC('2', {title: 'Ilya'}, 'todolistId2')

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId2'].length).toBe(3)
  expect(endState['todolistId2']['1'].title).toBe('Ilya')
  expect(endState['todolistId2'].every(t => t.title != 'milk')).toBeTruthy()
  expect(endState['todolistId1']['1'].title).toBe('React')
})

test('should be changed correct status task', () => {
  const action = updateTaskAC('2', {status: TaskStatuses.New}, 'todolistId2')

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
  expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
})


test('new array should be added when new todolist is added', () => {
  const action = addTodolistAC({
    id: 'asdasd',
    title: 'new todolist',
    order: 0,
    addedDate: ''
  })

  const endState = tasksReducer(startState, action)
  const keys = Object.keys(endState)
  const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
  if(!newKey) {
    throw Error('new key should be added')
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test('new array should be added when new todolist is added', () => {
  const action = addTaskAC({
    todoListId:'todolistId2',
    title:'bear',
    status:TaskStatuses.New,
    addedDate:'',
    deadline:'',
    order:0,
    priority:0,
    description:'',
    startDate:'',
    id:'id exists',
    entityStatus:'idle'
  })

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(4)
  expect(endState['todolistId2'][0].id).toBeDefined()
  expect(endState['todolistId2'][0].title).toBe('bear')
  expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('tasks should be added fo todolist', () => {
  const action = setTasksAC(startState['todolistId1'], 'todolistId1')

  const endState = tasksReducer({
    'todolistId2':[],
    'todolistId1':[]
  }, action)

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(0)
})

test('arrays should be added when set todolists', () => {
  const action = setTodolistsAC([
    {id: '1', title: 'What to learn', addedDate: '', order: 0},
    {id: '2', title: 'What to buy', addedDate: '', order: 0}
  ])

  const endState = tasksReducer({}, action)
  const keys = Object.keys(endState)

  expect(keys.length).toBe(2)
  expect(endState['1']).toBeDefined()
  expect(endState['2']).toBeDefined()
})

test('todolists should be delete', () => {
  const action = removeTodolistAC('todolistId2')

  const endState = tasksReducer(startState, action)
  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState['todolistId2']).not.toBeDefined()
})


// const dispatch = useAppDispatch();
// test(' TC should be remove correct task of array',()=>{
//   const action = removeTaskAC('2', 'todolistId2')
//
//   const thunk = removeTaskTC('todolistId2','2')
//   const endState = tasksReducer(startState, action)
//
//   expect(endState['todolistId2'].length).toBe(2)
//   expect(endState['todolistId1'].length).toBe(3)
//   expect(endState['todolistId2'].every(t=>t.id != '2')).toBeTruthy()
// })