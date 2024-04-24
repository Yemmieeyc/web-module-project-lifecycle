import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error:'',
    todoNameInput:'',
  }
  onTodoNameChange = evt => {
    const {value} = evt.target
    this.setState({...this.state, todoNameInput: value})
  }

  resetForm = () => this.state({...this.state, todoNameInput: ''})
  setAxiosResponseErr = err =>  this.setState({...this.state, error: err.response.data.message})

  
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
 
  render() {
    return (
      <div>
        <div id='error'>{this.state.error}</div>
        <div>
        <h2>Todos:</h2>
        { this.state.todos.map(td => {
          return <div onClick={this.toogleCompleted(td.id)} key={td.id}>{td.name} {td.completed ? ' ✔️ ' : ''}</div>
        })
          
        }
        </div>
      <form id="todoForm" onSubmit={this.onTodoFormSubmit}>
        <input value={this.state.todoNameInput} onChange={this.onTodoNameChange} type='text' placeholder='Type todo'></input>
        <input type='submit'></input>
        <button>Clear Completed</button>
      </form>
       </div>
    )
  }
}
