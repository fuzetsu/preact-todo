import TodoList from './cmp/todo-list.js'
import { m, useReducer, useEffect } from './lib/hooks.js'
import { safeParse } from './lib/util.js'
import { newTodo } from './cmp/todo.js'

z.helper({
  size: (x, y = x) => `h ${x}; w ${y}`,
  fade: 'transition opacity 300ms; opacity '
})

z.global`
  ff sans-serif
  fs 16
`

const savedTodos = safeParse(localStorage.todoV1, [])

const App = () => {
  const [state, update] = useReducer(mergerino, { todos: savedTodos, draft: newTodo('') })
  useEffect(() => (localStorage.todoV1 = JSON.stringify(state.todos)), [state.todos])

  return m(
    'main' + z`m auto; w 400`,
    m('h1' + z`m 10;ml 25`, 'Todo'),
    m(TodoList, { state, update })
  )
}

preact.render(m(App), document.body)
