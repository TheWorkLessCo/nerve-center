import { useEffect } from 'react'

function OpenClawView() {
  useEffect(() => {
    window.location.href = 'http://72.62.83.62:18789'
  }, [])

  return null
}

export default OpenClawView
