import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUserCog } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { VisitaTecnicaDetalles } from '../VisitaTecnicaDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Dropdown, Form, FormField, FormGroup, Label } from 'semantic-ui-react'
import { convertTo12HourFormat, formatDate, formatDateInc } from '@/helpers'
import { getStatusClass } from '@/helpers/getStatusClass/getStatusClass'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './VisitaTecnicaList.module.css'

export function VisitaTecnicaList(props) {

  const { reload, onReload, visitatecnica, onToastSuccessMod, onToastSuccessDel } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [visitatecnicaSeleccionada, setVisitatecnicaSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (visitatecnica) => {
    setVisitatecnicaSeleccionada(visitatecnica)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setVisitatecnicaSeleccionada(null)
    setShowDetalles(false)
  }

  const opcionesEstado = [
    { key: 1, text: 'Todas', value: 'Todas' },
    { key: 2, text: 'Pendiente', value: 'Pendiente' },
    { key: 3, text: 'En proceso', value: 'En proceso' },
    { key: 4, text: 'Realizada', value: 'Realizada' }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800) 

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <>

      {showLoading ? (
        <Loading size={45} loading={1} />
      ) : (
        size(visitatecnica) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(visitatecnica, (visitatecnica) => {
              const statusClass = getStatusClass(visitatecnica.estado)

              return (
                <div key={visitatecnica.id} className={styles.section} onClick={() => onOpenDetalles(visitatecnica)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaUserCog />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Visita técnica</h1>
                        <h2>{visitatecnica.visitatecnica}</h2>
                      </div>
                      <div >
                        <h1>Fecha</h1>
                        <h2>{formatDate(visitatecnica.date)}</h2>
                      </div>
                      <div>
                        <h1>Estatus</h1>
                        <h2>{visitatecnica.estado}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles de la visita técnica' show={showDetalles} onClose={onCloseDetalles}>
        {visitatecnicaSeleccionada && (
          <VisitaTecnicaDetalles
            reload={reload}
            onReload={onReload}
            visitatecnica={visitatecnicaSeleccionada}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
