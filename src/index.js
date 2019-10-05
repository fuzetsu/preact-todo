import TodoList from './cmp/todo-list.js'
import { m } from './lib/hooks.js'

z.helper({
  size: (x, y = x) => `h ${x}; w ${y}`,
  fade: 'transition opacity 300ms; opacity '
})

z.global`
  ff sans-serif
  fs 16
`

const App = () => {
  return m('main' + z`m auto; w 400`, m('h1' + z`m 10;ml 25`, 'Todo'), m(TodoList))
}

preact.render(m(App), document.body)
