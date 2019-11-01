import TodoList from './cmp/todo-list.js'
import { m, useReducer, useDomEvent, usePersist, useEffect } from './lib/hooks.js'
import { safeParse, makeTheme } from './lib/util.js'
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

const theme = makeTheme`
  $fg-color ${{ day: 'black', night: 'white' }}
  $fg-color2 ${{ day: '#444', night: '#eee' }}
  $bg-color ${{ day: '#fefefe', night: '#111' }}
`

const setTheme = night => z.global(theme(night ? 'night' : 'day'))

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
    m(
      'h1' + z`m 10;ml 25;cursor pointer;us none`,
      {
        onclick: () => update({ night: !night })
      },
      'Todo ',
      night ? '🌕' : '⭐'
    ),
    m(TodoList, { state, update })
  )
}

preact.render(m(App), document.body)
