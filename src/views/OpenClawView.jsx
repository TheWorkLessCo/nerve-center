import { useEffect } from 'react'

function OpenClawView() {
  useEffect(() => {
    window.location.href = 'http://localhost:18789/#token=4d8707be638d4f7cd95c2dfd09e563cdf8d8c864676c9def'
  }, [])

  return null
}

export default OpenClawView
