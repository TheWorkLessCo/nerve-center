import { useEffect } from 'react'

function MissionControlView() {
  useEffect(() => {
    window.location.href = 'http://72.62.83.62:4000'
  }, [])

  return null
}

export default MissionControlView
