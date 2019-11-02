export const safeParse = (json, fallback = {}) => {
  try {
    return JSON.parse(json)
  } catch (e) {
    return fallback
  }
}

export const clamp = (min, val, max) => Math.min(max, Math.max(min, val))

export const p = (...args) => (console.log(...args), args[0])

export const last = arr => arr[arr.length - 1]

export const handleOnce = (elem, type) =>
  new Promise(done => elem.addEventListener(type, done, { once: true }))

export const animEnd = (elem, type = 'transition') => handleOnce(elem, type + 'end')

export const makeTheme = (parts, ...args) => key =>
  args.concat('').reduce((acc, x, i) => acc + parts[i] + (typeof x === 'object' ? x[key] : x), '')

export const processEnum = (name, members) =>
  Object.fromEntries(members.map(x => [x, name + '.' + x]))

export const sleep = ms => new Promise((done, id) => (id = setTimeout(done, ms, id)))

export const pipe = (...fns) => (...args) =>
  fns.slice(1).reduce((acc, fn) => fn(acc), fns[0](...args))
