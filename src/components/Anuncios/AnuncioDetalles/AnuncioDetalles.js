import { IconClose, Confirm, DatosRes } from '@/components/Layouts';
import { convertTo12HourFormat, formatDate } from '@/helpers';
import { BasicModal } from '@/layouts';
import { FaCheck, FaEdit, FaInfoCircle, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { AnuncioEditForm } from '../AnuncioEditForm/AnuncioEditForm';
import axios from 'axios';
import styles from './AnuncioDetalles.module.css';
import { useAuth } from '@/contexts/AuthContext';

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

  return (
    <>
      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Anuncio</h1>
              <h2>{anuncio.anuncio}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{anuncio.descripcion}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{anuncio.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDate(anuncio.date)}</h2>
            </div>
            <div>
              <h1>Hora</h1>
              <h2>{convertTo12HourFormat(anuncio.hora)}</h2>
            </div>
          </div>
        </div>

        {user && user.isadmin === 'Admin' || user && user.isadmin === 'Comité' ? (
          <>

            <div className={styles.iconEdit}>
              <div>
                <FaEdit onClick={onOpenEditAnuncio} />
              </div>
            </div>
              <div className={styles.iconDel}>
                <div>
                  <FaTrash onClick={onOpenCloseConfirmDel} />
                </div>
              </div>
          </>
        ) : (
          ''
        )}
      </div>

      <BasicModal title='Editar anuncio' show={showEditAnuncio} onClose={onOpenEditAnuncio}>
        <AnuncioEditForm reload={reload} onReload={onReload} anuncio={anuncio} onOpenEditAnuncio={onOpenEditAnuncio} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={handleDeleteAnuncio}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el anuncio ?'
      />

    </>
  )
}
