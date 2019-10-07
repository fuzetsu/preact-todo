export const { useState, useReducer, useEffect, useRef } = preactHooks

export const m = microh(preact.h)

const inputTypes = ['INPUT', 'TEXTAREA']
export const useDomEvent = ({
  type,
  handler,
  target = window,
  disabled = false,
  filterInput = false
}) => {
  const ref = useRef()
  ref.current = handler
  useEffect(() => {
    if (disabled) return
    const fn = e => {
      if (filterInput && inputTypes.includes(e.target.nodeName)) return
      ref.current(e)
    }
    target.addEventListener(type, fn)
    return () => target.removeEventListener(type, fn)
  }, [disabled])
}

export const usePersist = (key, target, delay = 200) => {
  const id = useRef()
  useEffect(() => {
    clearTimeout(id.current)
    const persist = () => localStorage.setItem(key, JSON.stringify(target))
    if (delay > 0) id.current = setTimeout(persist, delay)
    else persist()
    return () => clearTimeout(id.current)
  }, [key, target, delay])
}
