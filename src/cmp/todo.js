import { useRef, useEffect, m } from '../lib/hooks.js'
import { iconCheck, lineThrough, iconSend, iconX } from '../lib/view-util.js'

export const newTodo = text => ({
  id: Math.random()
    .toString(36)
    .slice(2),
  text,
  done: false
})

export default function Todo({ todo, local, update, onfocus, focused = false, draft = false }) {
  const { text, done } = todo

  const addTodo = () => {
    if (!text) return
    update({ todos: x => [newTodo(text)].concat(x) })
    local({ text: '' })
  }

  const removeTodo = () => update({ todos: todos => todos.filter(x => x !== todo) })

  const input = useRef()
  useEffect(() => {
    const txt = input.current
    if (txt && focused) {
      txt.focus()
      txt.selectionStart = txt.selectionEnd = txt.value.length
    }
  }, [focused])

  return m(
    'div',
    iconCheck({
      className: draft && z`visibility hidden`.class,
      checked: done,
      onclick: () => local({ done: !done })
    }),
    lineThrough(
      done,
      m(
        'input' +
          z`
            fs 20; p 10; m 2
            border 1px solid
            bc $bg-color
            c $fg-color
            outline none
          ` +
          z(!draft && !focused && 'c $fg-color2;border none;m 3'),
        {
          ref: input,
          value: text,
          onfocus,
          placeholder: 'buy tofu',
          oninput: ({ target: { value } }) => (draft || focused) && local({ text: value }),
          onkeydown: e => {
            if (e.key === 'Enter') {
              if (draft) addTodo()
              else {
                if (e.ctrlKey) {
                  e.stopPropagation()
                  local({ done: !done })
                } else e.target.blur()
              }
            }
          }
        }
      )
    ),
    draft &&
      iconSend({
        style: `position relative;l -35;t -3;fade ${text ? 1 : 0}`,
        onclick: () => {
          addTodo()
          input.current.focus()
        }
      }),
    !draft && iconX({ onclick: removeTodo })
  )
}
