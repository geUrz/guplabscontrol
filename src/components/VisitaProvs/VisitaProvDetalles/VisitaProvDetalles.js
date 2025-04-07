import { IconClose, Confirm, DatosAuth, IconEdit, IconDel } from '@/components/Layouts'
import { formatDateVT } from '@/helpers'
import { BasicModal } from '@/layouts'
import { FaCheck, FaEdit, FaInfoCircle, FaTimes, FaTrash } from 'react-icons/fa'
import { useEffect, useMemo, useState } from 'react'
import { VisitaProvEditForm } from '../VisitaProvEditForm/VisitaProvEditForm'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import styles from './VisitaProvDetalles.module.css'

export function VisitaProvDetalles(props) {
  const { reload, onReload, visitaprov, onCloseDetalles, onToastSuccessMod, onToastSuccessDel } = props
  
  const { user } = useAuth()

  const [showEditVisitaprov, setShowEditVisitaprov] = useState(false)

  const onOpenEditVisitaprov = () => setShowEditVisitaprov((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteVisitaprov = async () => {
    if (visitaprov?.id) {
      try {
        await axios.delete(`/api/visitaprovedores/visitaprovedores?id=${visitaprov.id}`)
        onReload()
        onToastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar el visita proveedor:', error)
      }
    } else {
      console.error('Visita proveedor o ID no disponible')
    }
  }

  const [visitaprovData, setVisitaprovData] = useState(visitaprov)
    
      useEffect(() => {
        setVisitaprovData(visitaprov)
      }, [visitaprov])
    
      const actualizarVisitaprov = (nuevaData) => {
        setVisitaprovData((prevState) => ({
          ...prevState,
          ...nuevaData,
        }))
      }

  const permissions = useMemo(() => {

    if(!user) return {}

    return{
      showAdmin: ['Admin', 'ComitéSU', 'Caseta'].includes(user?.isadmin)
    }

  }, [user])

  return (
    <>
      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Visita proveedor</h1>
              <h2>{visitaprovData?.visitaprovedor}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{visitaprovData?.descripcion}</h2>
            </div>
            <div>
              <h1>Autorizó</h1>
              <h2>{visitaprovData?.autorizo_usuario}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{visitaprovData?.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDateVT(visitaprovData?.createdAt)}</h2>
            </div>
            <div>
              <h1>Estado</h1>
              <h2>{visitaprovData?.estado}</h2>
            </div>
          </div>
        </div>

        {permissions.showAdmin &&
          <>

            <IconEdit onOpenEdit={onOpenEditVisitaprov} />
            <IconDel setShowConfirmDel={onOpenCloseConfirmDel} />

          </>
        }

      </div>

      <BasicModal title='Editar visita proveedor' show={showEditVisitaprov} onClose={onOpenEditVisitaprov}>
        <VisitaProvEditForm reload={reload} onReload={onReload} visitaprovData={visitaprovData} actualizarVisitaprov={actualizarVisitaprov} onOpenEditVisitaprov={onOpenEditVisitaprov} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        onConfirm={handleDeleteVisitaprov}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la visita proveedor ?'
      />

    </>
  )
}
