import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { ReportesListSearch, VisitaTecnicaListSearch } from '../VisitaTecnicaListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import styles from './SearchVisitaTecnica.module.css';

export function SearchVisitaTecnica(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const {user} = useAuth()

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [visitatecnica, setVisitatecnica] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setVisitatecnica([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/visitatecnica/visitatecnica?search=${query}`)
        const filteredVisitatecnica = res.data.filter(visitatecnica => visitatecnica.residencial_id === user.residencial_id)
        setVisitatecnica(filteredVisitatecnica)
      } catch (err) {
        setError('No se encontraron visita técnica')
        setVisitatecnica([])
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
          placeholder="Buscar visita técnica..."
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
        {visitatecnica.length > 0 && (
          <div className={styles.resultsContainer}>
            <VisitaTecnicaListSearch visitatecnica={visitatecnica} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
