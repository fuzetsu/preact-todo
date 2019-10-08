import { useState, m } from '../lib/hooks.js'
import Todo, { newTodo } from './todo.js'

export default function TodoList({ state, update }) {
  const { draft, todos = [] } = state

  const [focusIndex, setFocusIndex] = useState(-1)
  const keyHandler = e => {
    if (e.key === 'Enter' && focusIndex > -1) {
      update({
        todos: x => {
          const copy = x.slice()
          copy.splice(focusIndex + 1, 0, newTodo(''))
          return copy
        }
      })
      setFocusIndex(focusIndex + 1)
    } else if (e.key === 'ArrowDown' || (!e.shiftKey && e.key === 'Tab')) {
      e.preventDefault()
      setFocusIndex(Math.min(todos.length - 1, focusIndex + 1))
    } else if (e.key === 'ArrowUp' || (e.shiftKey && e.key === 'Tab')) {
      e.preventDefault()
      setFocusIndex(Math.max(-1, focusIndex - 1))
    } else if (e.key === 'Backspace' && focusIndex > -1 && document.activeElement.value === '') {
      update({ todos: { [focusIndex]: undefined } })
      const newLength = todos.length - 1
      if (focusIndex > 0) setFocusIndex(focusIndex - 1)
      else if (newLength < 1) setFocusIndex(-1)
      else if (focusIndex > newLength - 1) setFocusIndex(newLength - 1)
    }
  }

  return m(
    '',
    { onkeydown: keyHandler },
    m(Todo, {
      draft: true,
      todo: draft,
      update,
      focused: focusIndex === -1,
      local: up => update({ draft: up }),
      onfocus: () => setFocusIndex(-1)
    }),
    todos.map((todo, idx) =>
      m(Todo, {
        key: todo.id,
        todo,
        update,
        focused: focusIndex === idx,
        local: up => update({ todos: { [idx]: up } }),
        onfocus: () => setFocusIndex(idx)
      })
    ),
    m('' + z`mt 8;ml 30`, todos.filter(x => x.done).length, ' done, ', todos.length, ' total')
  )
}
