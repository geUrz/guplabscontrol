import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { CotizacionListSearch, RecibosListSearch, ReportesListSearch } from '../ReportesListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import styles from './SearchReporte.module.css';

export function SearchReporte(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const {user} = useAuth()

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reportes, setReportes] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setReportes([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/reportes/reportes?search=${query}`)
        const filteredReportes = res.data.filter(reporte => reporte.residencial_id === user.residencial_id)
        setReportes(filteredReportes)
      } catch (err) {
        setError('No se encontraron reportes')
        setReportes([])
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
          placeholder="Buscar reporte..."
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
        {reportes.length > 0 && (
          <div className={styles.resultsContainer}>
            <ReportesListSearch reportes={reportes} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
