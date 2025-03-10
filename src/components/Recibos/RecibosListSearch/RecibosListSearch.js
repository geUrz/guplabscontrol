import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { FaFileInvoice } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { ReciboDetalles } from '../ReciboDetalles'
import styles from './RecibosListSearch.module.css'
import axios from 'axios'
import { formatDateIncDet } from '@/helpers'

export function RecibosListSearch(props) {

  const { reload, onReload, recibos, onToastSuccessMod, onToastSuccessDel } = props

  const [show, setShow] = useState(false)
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenClose = async (cotizacion) => {
    try {
      const response = await axios.get(`/api/recibos/conceptos?recibo_id=${cotizacion.id}`)
      cotizacion.conceptos = response.data
      setReciboSeleccionado(cotizacion)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
    }
  }

  const onCloseDetalles = () => {
    setVisitaSeleccionada(null)
    setShowDetalles(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800) 

    return () => clearTimeout(timer)
  }, [])

  return (

    <>

      {showLoading ? 
        <Loading size={45} loading={1} /> :
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
                   <h2>{formatDateIncDet(recibo.createdAt)}</h2>
                 </div>
               </div>
             </div>
           </div>
            ))}
          </div>
      }

      <BasicModal title='detalles de la cotización' show={show} onClose={onCloseDetalles}>
        {reciboSeleccionado && (
          <ReciboDetalles
            reload={reload}
            onReload={onReload}
            recibo={reciboSeleccionado} 
            reciboId={reciboSeleccionado}
            onOpenClose={onOpenClose}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
