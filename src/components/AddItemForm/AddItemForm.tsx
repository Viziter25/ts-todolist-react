import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import AddchartIcon from '@mui/icons-material/Addchart';
import {IconButton, TextField} from '@mui/material';

type AddItemFormPropsType = {
  addItem: (title: string) => void
}

export const AddItemForm = (props: AddItemFormPropsType) => {

  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
    setError(null)
  }

  const addTasksHandler = () => {
    if (title.trim() !== '') {
      props.addItem(title)
      setTitle('')
    } else {
      setError('Title is required')
    }
  }

  const onKeyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      props.addItem(title)
      setTitle('')
    }
  }

  return (
    <div>
      <TextField error={!!error}
                 label="Title todolist"
                 id="fullWidth"
                 value={title}
                 type="text"
                 onKeyUp={onKeyUpHandler}
                 onChange={onChangeHandler}/>
      {/*<input value={title} type="text" onKeyUp={onKeyUpHandler} onChange={onChangeHandler} className={error ? s.error : ''}/>*/}
      <IconButton color="success" aria-label="add to shopping cart" onClick={addTasksHandler}>
        <AddchartIcon fontSize="large"/>
      </IconButton>
      {/*<button onClick={addTasksHandler} >+</button>*/}
      {/*{error && <div className={s.errorMessage}>{error}</div>}*/}
    </div>
  );
};
