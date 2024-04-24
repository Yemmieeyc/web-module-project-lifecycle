import React from 'react'
import axios from 'axios'
import Form from './Form'
import TodoList from './TodoList'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error:'',
    todoNameInput:'',
    displayCompleteds: true,
  }
  onTodoNameChange = evt => {
    const {value} = evt.target
    this.setState({...this.state, todoNameInput: value})
  }

  resetForm = () => this.state({...this.state, todoNameInput: ''})
  
  setAxiosResponseErr = err =>
  this.setState({...this.state, error: err.response.data.message})

  
  postNewTodo = () => {
    axios.post(URL, {name: this.state.todoNameInput})
    .then(res =>{
      this.setState({...this.state, todos:this.state.todos.concat(res.data.data)})
      //this.fetchAllTodos()
      this.resetForm()
    })
    .catch(this.setAxiosResponseErr)
  }

   onTodoFormSubmit = evt => {
    evt.preventDefault()
    this.postNewTodo()
  }

fetchAllTodos = () => {
axios.get(URL)
.then(res => {
this.setState({...this.state, todos: res.data.data})
})
.catch(this.setAxiosResponseErr)
}

toogleCompleted = id => () => {
  axios.patch(`${URL}/${id}`)
  .then(res => {
    this.setState({...this.state, todos: this.state.todos.map(td => {
      if(td.id !== id) return td
      return res.data.data
    })})
   // this.fetchAllTodos()
  })
  .catch(this.setAxiosResponseErr)
}

  componentDidMount(){
    this.fetchAllTodos()
  }
  toogleDisplayCompleteds = () => {
    this.setState({...this.state, displayCompleteds: !this.state.displayCompleteds})
  }
 
  render() {
    return (
      <div>
        <div id='error'>Error: {this.state.error}</div>
        <TodoList
        todos={this.state.todos}
        displayCompleteds={this.state.displayCompleteds}
        toogleCompleted={this.toogleCompleted}
        />
      <Form
      onTodoFormSubmit={this.onTodoFormSubmit}
      onTodoNameChange={this.onTodoNameChange}
      toogleDisplayCompleteds={this.toogleDisplayCompleteds}
      todoNameInput={this.state.todoNameInput}
      displayCompleteds={this.state.displayCompleteds}

      />
       </div>
    )
  }
}
