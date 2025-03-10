import { useState } from 'react'
import { map, size } from 'lodash'
import styles from './ReciboLista.module.css'
import axios from 'axios'
import { ListEmpty, Loading, ToastSuccess } from '@/components/Layouts'
import { FaFileInvoice } from 'react-icons/fa'
import {  formatDateIncDet } from '@/helpers'
import { BasicModal } from '@/layouts'
import { ReciboDetalles } from '../ReciboDetalles'

export function ReciboLista(props) {

  const { reload, onReload, recibos, onToastSuccess, onToastSuccessMod, onToastSuccessDel } = props

  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessConfirm, setToastSuccessConfirm] = useState(false)
  const [toastSuccessDelete, setToastSuccessDelete] = useState(false)

  const onShowConfirm = () => setShowConfirm((prevState) => !prevState)

  const onOpenClose = async (recibo) => {

    if (!recibo || !recibo.id) {
      setShow(false)
      return;
    }

    try {
      const response = await axios.get(`/api/recibos/conceptos?recibo_id=${recibo.id}`)
      recibo.conceptos = response.data
      setReciboSeleccionado(recibo)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
      setShow(false)
    }
  }

  const onDeleteConcept = async (conceptoId) => {
    try {
      const response = await axios.delete(`/api/recibos/conceptos`, {
        params: { concepto_id: conceptoId },
      })
      if (response.status === 200) {
        setReciboSeleccionado((prevState) => ({
          ...prevState,
          conceptos: prevState.conceptos.filter((concepto) => concepto.id !== conceptoId),
        }))
      } else {
        console.error('Error al eliminar el concepto: Respuesta del servidor no fue exitosa', response);
      }
    } catch (error) {
      console.error('Error al eliminar el concepto:', error.response || error.message || error);
    }
  }

  const onAddConcept = (concept) => {
    setReciboSeleccionado((prevState) => ({
      ...prevState,
      conceptos: [...prevState.conceptos, concept],
    }))
    onReload()
  }

  return (

    <>

      {toastSuccess && <ToastSuccess contain='Concepto creado exitosamente' onClose={() => setToastSuccess(false)} />}

      {toastSuccessConfirm && <ToastSuccess contain='Recibo eliminado exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {toastSuccessDelete && <ToastSuccess contain='Concepto eliminado exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {!recibos ? (
        <Loading size={45} loading={1} />
      ) : (
        size(recibos) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(recibos, (recibo) => (
             <div key={recibo.id} className={styles.section} onClick={() => onOpenClose(recibo)}>
             <div>
               <div className={styles.column1}>
                 <FaFileInvoice />
               </div>
               <div className={styles.column2}>
                 <div>
                   <h1>Recibo</h1>
                   <h2>{recibo.recibo}</h2>
                 </div>
                 <div>
                   <h1>Fecha</h1>
                   <h2>{formatDateIncDet(recibo?.createdAt)}</h2>
                 </div>
               </div>
             </div>
           </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del recibo' show={show} onClose={onOpenClose}>
        <ReciboDetalles recibo={reciboSeleccionado} reciboId={reciboSeleccionado} reload={reload} onReload={onReload} onShowConfirm={onShowConfirm} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} onAddConcept={onAddConcept} onDeleteConcept={onDeleteConcept} reciboSeleccionado={setReciboSeleccionado} />
      </BasicModal>

    </>

  )
}
