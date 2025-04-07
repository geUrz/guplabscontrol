import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout } from '@/layouts'
import { ValidarCodigo } from '@/components/ValidarVisitas/ValidarCodigo/ValidarCodigo'
import { DatosCodigo } from '@/components/ValidarVisitas'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { SearchVisitas, VisitasList, VisitasListSearch } from '@/components/Visitas'
import styles from './validarvisitas.module.css'
import { FaSearch } from 'react-icons/fa'
import { ToastSuccessQRValido } from '@/components/Layouts/Toast/ToastSuccessQRValido'
import { useAuth } from '@/contexts/AuthContext'

export default function Validarvisitas() {

  const {user, loading} = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [visita, setVisita] = useState(null)

  const [visitas, setVisitas] = useState(null)
  
  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [toastSuccessQRValido, setToastSuccessQRValido] = useState(false)
  const [toastSuccessMod, setToastSuccessMod] = useState(false)
  const [toastSuccessDel, setToastSuccessDel] = useState(false)

  const onToastSuccessQRValido = () => setToastSuccessQRValido((prevState) => !prevState)

  const onToastSuccessMod = () => {
    setToastSuccessMod(true)
    setTimeout(() => {
      setToastSuccessMod(false)
    }, 3000)
  }

  const onToastSuccessDel = () => {
    setToastSuccessDel(true)
    setTimeout(() => {
      setToastSuccessDel(false)
    }, 3000)
  }

  useEffect(() => {

    if (!user || !user.id || !user.residencial_id) return

    (async () => {
      try {
        const res = await axios.get('/api/visitas/visitas')
        const filteredVisitas = res.data.filter(visita => visita.residencial_id === user.residencial_id) 
        setVisitas(filteredVisitas)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [user, reload])

  if (loading) {
      return <Loading size={45} loading={'L'} />
    }

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        <Title title='validar visitas' />

      {toastSuccessQRValido && <ToastSuccessQRValido onToastSuccessQRValido={onToastSuccessQRValido} />}

        {toastSuccessMod && <ToastSuccess contain='Modificada exitosamente' onClose={() => setToastSuccessMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminada exitosamente' onClose={() => setToastSuccessDel(false)} />}

        <DatosCodigo visita={visita} reload={reload} onReload={onReload} />

        <ValidarCodigo setVisita={setVisita} reload={reload} onReload={onReload} onToastSuccessQRValido={onToastSuccessQRValido} />

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchVisitas user={user} onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <VisitasListSearch user={user} visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar visita</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        <VisitasList visitas={visitas} reload={reload} onReload={onReload} user={user} loading={loading} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} activateFilter={false} />

      </BasicLayout>

    </ProtectedRoute>

  )
}
