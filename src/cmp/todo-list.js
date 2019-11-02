import { processEnum } from '../lib/util.js'
import { useState, m } from '../lib/hooks.js'

import Todo, { newTodo } from './todo.js'

const filters = ['All', 'Active', 'Completed']
const Filter = processEnum('Filter', filters)

const applyFilter = (filter, todos) =>
  filter === Filter.All
    ? todos
    : todos.filter(x => x.animating || (filter === Filter.Completed ? x.done : !x.done))

export default function TodoList({ state, update }) {
  const { draft, filter = Filter.All } = state

  const todos = applyFilter(filter, state.todos || [])

  const realIndex = idx => state.todos.indexOf(todos[idx])

  const [focusIndex, setFocusIndex] = useState(-1)
  const keyHandler = e => {
    if (e.key === 'Enter') {
      if (focusIndex < 0 || filter === Filter.Completed) return
      update({
        todos: x => {
          const copy = x.slice()
          copy.splice(realIndex(focusIndex) + 1, 0, newTodo(''))
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
      e.preventDefault()
      update({ todos: { [realIndex(focusIndex)]: undefined } })
      const newLength = todos.length - 1
      if (focusIndex > 0) setFocusIndex(focusIndex - 1)
      else if (newLength < 1) setFocusIndex(-1)
      else if (focusIndex > newLength - 1) setFocusIndex(newLength - 1)
    }
  }

  return m(
    'div',
    { onkeydown: keyHandler },
    m(Todo, {
      draft: true,
      todo: draft,
      update,
      focused: focusIndex === -1,
      local: up => update({ draft: up }),
      onfocus: () => setFocusIndex(-1)
    }),
    m(
      'div' + z`ml 30;mt 10`,
      filters.map(x =>
        m(
          'span' + z`cursor pointer;m 5` + z(Filter[x] === filter && 'td underline'),
          {
            onclick: () => {
              setFocusIndex(-1)
              update({ filter: Filter[x] })
            }
          },
          x
        )
      )
    ),
    todos.map((todo, idx) =>
      m(Todo, {
        key: todo.id,
        todo,
        update,
        focused: focusIndex === idx,
        local: up => update({ todos: { [realIndex(idx)]: up } }),
        onfocus: () => setFocusIndex(idx)
      })
    ),
    m('' + z`mt 8;ml 30`, todos.filter(x => x.done).length, ' done, ', todos.length, ' total')
  )
}
