const m = microh(preact.h)

const icon = ({ style, ...attrs }, styl, body) =>
  m(
    'svg' +
      z`
      size 24
      cursor pointer
      va middle
      stroke $fg-color
      sw 2
      stroke-linecap round
      stroke-linejoin round
      us none
    ` +
      z(style) +
      z(styl),
    { ...attrs, viewBox: '0 0 24 24' },
    body
  )

export const iconX = (attrs = {}) =>
  icon(attrs, 'transition stroke 500ms; :hover { stroke red }', [
    m('line', {
      x1: 18,
      y1: 6,
      x2: 6,
      y2: 18
    }),
    m('line', {
      x1: 6,
      y1: 6,
      x2: 18,
      y2: 18
    })
  ])

export const iconCheck = ({ checked, ...attrs } = {}) =>
  icon(attrs, '', [
    m('rect' + z`transition fill 500ms; size 12` + z`fill ${checked ? '$fg-color' : '$bg-color'}`, {
      x: 4,
      y: 4
    })
  ])

export const iconSend = (attrs = {}) =>
  icon(attrs, '', [
    m('polygon' + z`transition 500ms;fill $fg-color;size 12;:hover { fill green; stroke green }`, {
      points: '0,0 0,24 24,12'
    })
  ])

export const lineThrough = (toggled, body) =>
  m(
    'span' +
      z`
      position relative
      :after {
        z-index 100
        position absolute
        h 1
        w ${toggled ? '92%' : 0}
        t 50%
        l 4%
        bc $fg-color
        transition width 500ms ease
        content ' '
      }
    `,
    body
  )
