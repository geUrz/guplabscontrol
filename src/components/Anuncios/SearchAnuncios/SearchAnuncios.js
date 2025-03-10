import { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from 'semantic-ui-react'
import { AnunciosListSearch } from '../AnunciosListSearch'
import { FaTimesCircle } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'
import styles from './SearchAnuncios.module.css'

export function SearchAnuncios(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const {user} = useAuth()

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [anuncios, setAnuncios] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setAnuncios([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/anuncios/anuncios?search=${query}`)
        const filteredIncidencias = res.data.filter(anuncio => anuncio.residencial_id === user.residencial_id)
        setAnuncios(filteredIncidencias)
      } catch (err) {
        setError('No se encontraron anuncios')
        setAnuncios([])
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
          placeholder="Buscar anuncio..."
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
        {anuncios.length > 0 && (
          <div className={styles.resultsContainer}>
            <AnunciosListSearch anuncios={anuncios} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
