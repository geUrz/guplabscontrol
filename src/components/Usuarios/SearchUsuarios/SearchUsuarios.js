import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { UsuariosListSearch } from '../UsuariosListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchUsuarios.module.css';

export function SearchUsuarios(props) {

  const {user, reload, onReload, onResults, onOpenCloseSearch, onToastSuccessUsuarioMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setUsuarios([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/usuarios/usuarios?search=${query}`)
        const filteredUsuarios = res.data.filter(usuario => 
          usuario.residencial_id === user.residencial_id && 
          ['Admin', 'Técnico'].includes(usuario.isadmin)
        )
        setUsuarios(filteredUsuarios)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('No se encontraron usuarios')
        setUsuarios([])
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
          placeholder="Buscar usuario..."
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
        {usuarios.length > 0 && (
          <div className={styles.resultsContainer}>
            <UsuariosListSearch usuarios={usuarios} reload={reload} onReload={onReload} onToastSuccessUsuarioMod={onToastSuccessUsuarioMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
