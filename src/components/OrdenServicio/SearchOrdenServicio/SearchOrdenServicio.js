import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { CotizacionListSearch, OrdenServicioListSearch, RecibosListSearch, ReportesListSearch } from '../OrdenServicioListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import styles from './SearchOrdenServicio.module.css';

export function SearchOrdenServicio(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const {user} = useAuth()

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ordenservicio, setOrdenservicio] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setOrdenservicio([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/ordenservicio/ordenservicio?search=${query}`)
        const filteredOrdenservicio = res.data.filter(ordenservicio => ordenservicio.residencial_id === user.residencial_id)
        setOrdenservicio(filteredOrdenservicio)
      } catch (err) {
        setError('No se encontraron orden de servicio')
        setOrdenservicio([])
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
          placeholder="Buscar orden de servicio..."
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
        {ordenservicio.length > 0 && (
          <div className={styles.resultsContainer}>
            <OrdenServicioListSearch ordenservicio={ordenservicio} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
