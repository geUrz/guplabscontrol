import { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from 'semantic-ui-react'
import { ResidencialesListSearch } from '../ResidencialesListSearch'
import { FaTimesCircle } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'
import styles from './SearchResidencial.module.css'

export function SearchResidencial(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const {user} = useAuth()

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [residenciales, setResidenciales] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setResidenciales([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/residenciales/residenciales?search=${query}`)
        setResidenciales(res.data)
      } catch (err) {
        setError('No se encontraron residenciales')
        setResidenciales([])
      } finally {
        setLoading(false)
      }
    };

    fetchData()
  }, [query])

  return (
    <div className={styles.main}>

      <div className={styles.input}>
        <Input
          type="text"
          placeholder="Buscar residencial..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          loading={loading}
        />
        <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
          <FaTimesCircle />
        </div>
      </div>

      <div className={styles.visitaLista}>
        {error && <p>{error}</p>}
        {residenciales.length > 0 && (
          <div className={styles.resultsContainer}>
            <ResidencialesListSearch residenciales={residenciales} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
