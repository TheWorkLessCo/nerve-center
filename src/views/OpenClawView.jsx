import { useEffect } from 'react'

function OpenClawView() {
  useEffect(() => {
    window.location.href = 'http://localhost:18789'
  }, [])

  return null
}

export default OpenClawView
