import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function useSupabase(table) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!table) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: result, error: err } = await supabase.from(table).select('*')
        if (err) throw err
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [table])

  return { data, loading, error }
}

export default useSupabase
