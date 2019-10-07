import TodoList from './cmp/todo-list.js'
import { m, useReducer, useDomEvent, usePersist, useEffect } from './lib/hooks.js'
import { safeParse } from './lib/util.js'
import { newTodo } from './cmp/todo.js'

z.helper({
  size: (x, y = x) => `h ${x}; w ${y}`,
  fade: 'transition opacity 300ms; opacity '
})

z.global`
  ff sans-serif
  fs 16
  bc $bg-color
  c $fg-color
`

const setTheme = night =>
  night
    ? z.global`
        $fg-color white
        $fg-color2 #eee
        $bg-color #111
      `
    : z.global`
        $fg-color black
        $fg-color2 #444
        $bg-color #eee
      `

// migrate v1 storage
if (localStorage.todoV1) {
  localStorage.todoV2 = JSON.stringify({ todos: safeParse(localStorage.todoV1, []) })
  delete localStorage.todoV1
}

const init = {
  night: false,
  todos: [],
  ...safeParse(localStorage.todoV2, {}),
  draft: newTodo('')
}

// initialize theme
setTheme(init.night)

const App = () => {
  const [state, update] = useReducer(mergerino, init)

  usePersist('todoV2', state)

  const { night } = state
  useEffect(() => setTheme(night), [night])
  useDomEvent({
    type: 'keydown',
    filterInput: true,
    handler: ({ key }) => {
      if (key.toLowerCase() === 'n') update({ night: !night })
    }
  })

  return m(
    'main' + z`m auto; w 400`,
    m('h1' + z`m 10;ml 25`, 'Todo'),
    m(TodoList, { state, update })
  )
}

preact.render(m(App), document.body)
