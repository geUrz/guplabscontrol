import React, { useEffect, useMemo, useState } from 'react'
import { Add, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { SearchVisitaProv, VisitaProvForm, VisitaProvsList, VisitaProvsListSearch } from '@/components/VisitaProvs'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import styles from './visitaprovedores.module.css'
import { FaSearch } from 'react-icons/fa'

export default function Visitaprovedores() {

  const {user, loading} = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)
  
  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)
  
  const [resultados, setResultados] = useState([])

  const [visitaprovs, setVisitaprovs] = useState(null)

  useEffect(() => {
    if (user && user.residencial_id) {
      (async () => {
        try {
          const res = await axios.get(`/api/visitaprovedores/visitaprovedores?residencial_id=${user.residencial_id}`);
          setVisitaprovs(res.data);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [reload, user])

  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessMod, setToastSuccessMod] = useState(false)
  const [toastSuccessDel, setToastSuccessDel] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

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

  const permissions = useMemo(() => {

    if(!user) return {}

    return{
      showAdd: user?.isadmin !== 'Residente'
    }

  }, [user])

  if (loading) {
    return <Loading size={45} loading={'L'} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        <Title title='visita de proveedores' />

        {permissions.showAdd && (
          <Add onOpenClose={onOpenCloseForm} />
        )}

        {toastSuccess && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminado exitosamente' onClose={() => setToastSuccessDel(false)} />}

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchVisitaProv onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <VisitaProvsListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar visita proveedor</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        <VisitaProvsList reload={reload} onReload={onReload} visitaprovs={visitaprovs} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />

      </BasicLayout>

      <BasicModal title='crear visita proveedor' show={openForm} onClose={onOpenCloseForm}>
        <VisitaProvForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
