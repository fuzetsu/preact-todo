import { useRef, useEffect, m } from '../lib/hooks.js'
import { iconCheck, lineThrough, iconSend, iconX } from '../lib/view-util.js'

export const newTodo = text => ({ id: Math.random().toString(36), text, done: false })

export default function Todo({ todo, local, update, onclick, focused = false, draft = false }) {
  const { text, done } = todo

  const addTodo = () => {
    if (!text) return
    update({ todos: x => [newTodo(text)].concat(x) })
    local({ text: '' })
  }

  const removeTodo = () => update({ todos: x => x.filter(k => k !== todo) })

  const input = useRef()
  useEffect(() => input.current && focused && input.current.focus(), [focused])

  return m(
    '',
    { onclick },
    iconCheck({
      className: draft && z`visibility hidden`.class,
      checked: done,
      onclick: () => local({ done: !done })
    }),
    lineThrough(
      done,
      m(
        'input' +
          z`flex 1;border none; fs 20; p 10; border 1px solid; outline none; m 2` +
          z(!draft && !focused && 'c #444;border none;m 3'),
        {
          ref: input,
          value: text,
          placeholder: 'buy tofu',
          oninput: ({ target: { value } }) => (draft || focused) && local({ text: value }),
          onkeydown: ({ key, ctrlKey, target }) => {
            if (key === 'Enter') {
              if (draft) addTodo()
              else {
                if (ctrlKey) local({ done: !done })
                else target.blur()
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
