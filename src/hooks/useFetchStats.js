import { useEffect, useState } from 'react'

export const useFetchStats = () => {

  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch('/api/us/demo/keyword-analytics/data-stats', { method: 'POST' })
      .then(res => res.json())
      .then(json => {
        setLoading(false)
        if (json.data) {
          setStats(json.data)
        } else {
          setStats([])
        }
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { stats, loading, error, setStats }
}
