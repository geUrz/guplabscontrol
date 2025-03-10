import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { ResidentesListSearch, UsuariosListSearch } from '../ResidentesListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchResidentes.module.css';

export function SearchResidentes(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [residentes, setResidentes] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setResidentes([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await axios.get(`/api/usuarios/usuarios?search=${query}`)
        setResidentes(response.data)
      } catch (err) {
        setError('No se encontraron residentes')
        setResidentes([])
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
          placeholder="Buscar residente..."
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
        {residentes.length > 0 && (
          <div className={styles.resultsContainer}>
            <ResidentesListSearch residentes={residentes} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
