import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { ResidentesListSearch, UsuariosListSearch } from '../ResidentesListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchResidentes.module.css';

export function SearchResidentes(props) {

  const {user, reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [residentes, setResidentes] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setResidentes([])
        return;
      }
  
      setLoading(true)
      setError('')
  
      try {
        const res = await axios.get(`/api/usuarios/usuarios?search=${query}`)
        const filteredResidentes = res.data.filter(residente => 
          residente.residencial_id === user.residencial_id && 
          ['ComitéSU', 'Comité', 'Caseta', 'Residente'].includes(residente.isadmin)
        )
        setResidentes(filteredResidentes)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('No se encontraron residentes')
        setResidentes([])
      } finally {
        setLoading(false)
      }
    };
  
    fetchData()
  }, [query, user.residencial_id])
  

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
