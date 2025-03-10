import { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from 'semantic-ui-react'
import { AnunciosListSearch, VisitaProvsListSearch } from '../VisitaProvsListSearch'
import { FaTimesCircle } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'
import styles from './SearchVisitaProv.module.css'

export function SearchVisitaProv(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const {user} = useAuth()

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [visitaprovs, setVisitaprovs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setVisitaprovs([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/visitaprovedores/visitaprovedores?search=${query}`)
        const filteredVisitaprovs = res.data.filter(visitaprov => visitaprov.residencial_id === user.residencial_id)
        setVisitaprovs(filteredVisitaprovs)
      } catch (err) {
        setError('No se encontraron visitaprovs')
        setVisitaprovs([])
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
          placeholder="Buscar visita proveedor..."
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
        {visitaprovs.length > 0 && (
          <div className={styles.resultsContainer}>
            <VisitaProvsListSearch visitaprovs={visitaprovs} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
