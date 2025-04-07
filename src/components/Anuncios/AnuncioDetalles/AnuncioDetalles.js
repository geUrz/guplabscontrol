import { IconClose, Confirm, DatosRes, IconEdit, IconDel } from '@/components/Layouts'
import { convertTo12HourFormat, formatDate } from '@/helpers'
import { BasicModal } from '@/layouts'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useEffect, useMemo, useState } from 'react'
import { AnuncioEditForm } from '../AnuncioEditForm/AnuncioEditForm'
import axios from 'axios'
import styles from './AnuncioDetalles.module.css'
import { useAuth } from '@/contexts/AuthContext'

export function AnuncioDetalles(props) {
  const { reload, onReload, anuncio, onCloseDetalles, onToastSuccessMod, onToastSuccessDel } = props

  const { user } = useAuth()

  const [showEditAnuncio, setShowEditAnuncio] = useState(false)

  const onOpenEditAnuncio = () => setShowEditAnuncio((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteAnuncio = async () => {
    if (anuncio?.id) {
      try {
        await axios.delete(`/api/anuncios/anuncios?id=${anuncio.id}`)
        onReload()
        onToastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar el anuncio:', error)
      }
    } else {
      console.error('Anuncio o ID no disponible')
    }
  }

  const [anuncioData, setAnuncioData] = useState(anuncio)

  useEffect(() => {
    setAnuncioData(anuncio)
  }, [anuncio])

  const actualizarAnuncio = (nuevaData) => {
    setAnuncioData((prevState) => ({
      ...prevState,
      ...nuevaData,
    }))
  }

  const permissions = useMemo(() => {

    if(!user) return {}

    return{
      showAdmin: ['Admin', 'ComitéSU', 'Comité'].includes(user?.isadmin)
    }

  }, [user])

  return (
    <>
      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Anuncio</h1>
              <h2>{anuncioData?.anuncio}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{anuncioData?.descripcion}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{anuncioData?.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDate(anuncioData?.date)}</h2>
            </div>
            <div>
              <h1>Hora</h1>
              <h2>{convertTo12HourFormat(anuncioData?.hora)}</h2>
            </div>
          </div>
        </div>

        {permissions.showAdmin &&
          <>
            <IconEdit onOpenEdit={onOpenEditAnuncio} />
            <IconDel setShowConfirmDel={onOpenCloseConfirmDel} />
          </>
        }
      </div>

      <BasicModal title='Editar anuncio' show={showEditAnuncio} onClose={onOpenEditAnuncio}>
        <AnuncioEditForm reload={reload} onReload={onReload} anuncioData={anuncioData} actualizarAnuncio={actualizarAnuncio} onOpenEditAnuncio={onOpenEditAnuncio} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        onConfirm={handleDeleteAnuncio}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el anuncio ?'
      />

    </>
  )
}
