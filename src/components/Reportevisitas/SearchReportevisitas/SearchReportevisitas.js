import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { ReportevisitasListSearch } from '../ReportevisitasListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchReportevisitas.module.css';

export function SearchReportevisitas(props) {

  const {user, reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reporteVisitas, setReporteVisitas] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setReporteVisitas([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/reportevisitas/reportevisitas?search=${query}`)
        const filteredVisitas = res.data.filter(visita => visita.residencial_id === user.residencial_id)
        setReporteVisitas(filteredVisitas)
      } catch (err) {
        setError('No se encontraron visitas')
        setReporteVisitas([])
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
          placeholder="Buscar visita..."
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
        {reporteVisitas.length > 0 && (
          <div className={styles.resultsContainer}>
            <ReportevisitasListSearch user={user} reporteVisitas={reporteVisitas} reload={reload} onReload={onReload} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
