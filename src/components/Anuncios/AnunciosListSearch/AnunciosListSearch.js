import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { FaCarCrash } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { AnuncioDetalles } from '../AnuncioDetalles'
import styles from './AnunciosListSearch.module.css'
import { convertTo12HourFormat, formatDate } from '@/helpers'

export function AnunciosListSearch(props) {

  const { reload, onReload, anuncios, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [anuncioSeleccionado, setAnuncioSeleccionado] = useState(null)

  const onOpenDetalles = (anuncio) => {
    setAnuncioSeleccionado(anuncio)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setAnuncioSeleccionado(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!anuncios ?
        <Loading size={45} loading={1} /> :
        <div className={styles.main}>
          {map(anuncios, (anuncio) => (
            <div key={anuncio.id} className={styles.section} onClick={() => onOpenDetalles(anuncio)}>
              <div>
                <div className={styles.column1}>
                  <FaCarCrash />
                </div>
                <div className={styles.column2}>
                  <div >
                    <h1>Anuncio</h1>
                    <h2>{anuncio.anuncio}</h2>
                  </div>
                  <div >
                    <h1>Fecha</h1>
                    <h2>{formatDate(anuncio.date)}</h2>
                  </div>
                  <div >
                    <h1>Hora</h1>
                    <h2>{convertTo12HourFormat(anuncio.hora)}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }

      <BasicModal title='detalles del anuncio' show={showDetalles} onClose={onCloseDetalles}>
        {anuncioSeleccionado && (
          <AnuncioDetalles
            reload={reload}
            onReload={onReload}
            anuncio={anuncioSeleccionado}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
