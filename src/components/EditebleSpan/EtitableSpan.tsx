import React, {ChangeEvent, useState,KeyboardEvent} from 'react';


type EditableSpanPropsType = {
  title: string
  changeTitle:(newTitle:string) => void
}

export const EditableSpan = (props: EditableSpanPropsType) => {

  const [edit, setEdit] = useState(false)
  const [title, setTitle] = useState(props.title)

  const onDoubleClickHandler = () => {
    setEdit(!edit)
  }

  const onKeyUpHandler = (e:KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEdit(!edit)
      props.changeTitle(title)
    }
  }

  const onBlurHandler = () => {
    setEdit(!edit)
    props.changeTitle(title)
  }

  const onChangeHandler =(e:ChangeEvent<HTMLInputElement>)=>{
    setTitle(e.currentTarget.value)
  }

  return (edit
      ? <input value={title} onChange={onChangeHandler} onKeyUp={onKeyUpHandler} onBlur={onBlurHandler} autoFocus />
      : <span onDoubleClick={onDoubleClickHandler}>{props.title}</span>
  )
}