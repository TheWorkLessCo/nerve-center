import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function useRealtime(table, filter) {
  const [channel, setChannel] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!table) return

    const newChannel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          setData(payload)
        }
      )
      .subscribe()

    setChannel(newChannel)

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel)
      }
    }
  }, [table, filter])

  return { channel, data }
}

export default useRealtime
