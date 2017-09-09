import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux';
import './index.css';
import { createStore, combineReducers } from 'redux';
import {Component} from 'react';


let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  }
} //addTodo  -----------------------------------------------------

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  }
} //toggleTodo ---------------------------------------------------

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
}; //setVisibilityFilter ------------------------------------------

const todo = (state, action) => {
  switch(action.type){
    case 'ADD_TODO':
    return {
      id: action.id,
      text: action.text,
      completed: false
    };
    case 'TOGGLE_TODO':
    if (state.id !== action.id){
      return state;
    }
    return {
      ...state,
      completed: !state.completed
    };
    default:
      return state;
  }
}; //todo ---------------------------------------------------------

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [ ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
    return state.map(t => todo(t,action));
      default:
      return state;
  }
}; // todos ----------------------------

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch(action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}; //visibilityFilter -----------------------------------------------------

const todoApp = combineReducers({
  todos,
visibilityFilter
}); //getVisibleTodos -----------------------------------------------------

const Todo = ({
onClick,
completed,
text
}) => (
  <li
      onClick={onClick}
    style={{
      textDecoration:
        completed ?
        'line-through' :
        'none'
    }}>
    {text}
  </li>
  ) //Todo ------------------------------------------------

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
    <Todo
      key={todo.id}
      {...todo}
      onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
) // TodoList ------------------------------------------------

let AddTodo = ({dispatch}) => {
  let input;
  return (
    <div>
      <h1>Things To Do</h1>
    <input ref={node => {
        input = node;
      }} />
    <button onClick={() => {
      dispatch(addTodo(input.value));
        input.value = '';
      }} >
       Add ToDo
     </button>
     </div>
   );
};// AddTodo ------------------------------------------------

AddTodo = connect()(AddTodo);

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
    return todos;
    case 'SHOW_COMPLETED':
    return todos.filter(
      t => t.completed
    );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
} //getVisibleTodos -----------------------------------------------------

const Link = ({
  active,
  children,
  onClick
}) => {
  if(active){
    return <span>{children}</span>;
  }
  return (
    <a href="#"
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
      >
      {children}
    </a>
  );
}; //Link  -----------------------------------------------------------------

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active:
    ownProps.filter ===
    state.visibilityFilter
  };
}; //mapStateToLinkProps ----------------------------------------

const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch(
        setVisibilityFilter(ownProps.filter)
      );
    }
  }
} //mapDispatchToLinkProps -------------------------------------

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

const Footer = () => (
  <p>
    {' '}
    <button><FilterLink
      filter='SHOW_ALL'
      >All </FilterLink></button>
    {' '}
    <button ><FilterLink
      filter='SHOW_ACTIVE'
      > Active </FilterLink></button>
    {' '}
      <button><FilterLink
      filter='SHOW_COMPLETED'
      > Completed </FilterLink>  </button>
  </p>
) //Footer -----------------------------------------------------

const mapStateToTodoListProps = (
  state
) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  }
} // mapStateToTodoListProps -------------------------------------
const mapDispatchToTodoListProps = (
  dispatch
) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id));
    }
  }; //return
}; //mapDispatchToProps -----------------------------------------

const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

const TodoApp = () =>  (
    <div>
      <AddTodo />
        <VisibleTodoList />
     <Footer />
    </div>
  ) //TodoApp  ------------------------------------------------

  ReactDOM.render(
    <Provider store={createStore(todoApp)}>
    <TodoApp />
    </Provider>,
    document.getElementById('root')
  );
