export default function WarningTriangle() {
  return (
    <svg width='16' height='14' viewBox='0 0 16 14' aria-hidden='true'>
      <polygon
        points='8,0 16,14 0,14'
        fill='#f7b500'
        stroke='#ffffff'
        strokeWidth='1'
      />
      <text
        x='8'
        y='12'
        textAnchor='middle'
        fontSize='9'
        fontWeight='700'
        fill='#333333'
      >
        !
      </text>
    </svg>
  )
}
