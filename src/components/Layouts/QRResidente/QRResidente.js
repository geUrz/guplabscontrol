import { BiQrScan } from 'react-icons/bi'
import styles from './QRResidente.module.css'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { IconClose } from '../IconClose'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import { Image } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import { Loading } from '../Loading'
import { ResidenteQR } from '@/components/Visitas'

export function QRResidente(props) {

  const { reload, onReload } = props

  const { user } = useAuth()

  const [showQR, setShowQR] = useState(false)

  const onOpenCloseQR = () => setShowQR((prevState) => !prevState)

  const [codigoQR, setCodigoQR] = useState(null)

  const [loading, setLoading] = useState(true)

  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (codigoQR?.toDate) {
      const today = new Date();
      const toDate = new Date(codigoQR.toDate);
      setIsExpired(toDate < today);
    }
  }, [codigoQR])

  useEffect(() => {

    setLoading(true)

    if (showQR && user && user.id) {
      (async () => {
        try {
          const res = await axios.get(`/api/visitas/visitas?residente=${user.id}`)
          const filteredResidenteQR = res.data.filter(residenteQR => residenteQR.tipovisita === 'Residente')
          setCodigoQR(filteredResidenteQR[0])
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false)
        }
      })()
    } else {
      setCodigoQR(null)
    }

  }, [showQR, user])

  const onReloadQR = async () => {
    try {
      const res = await axios.get(`/api/visitas/visitas?residente=${user.id}`);
      const filteredResidenteQR = res.data.filter(residenteQR => residenteQR.tipovisita === 'Residente');

      setCodigoQR(filteredResidenteQR[0]); // Actualiza el QR en tiempo real
    } catch (error) {
      console.error('Error al recargar el código QR:', error);
    }
  };


  return (

    <>

      <div className={styles.main}>
        <div className={styles.section}>
          <div onClick={onOpenCloseQR}>
            <BiQrScan />
          </div>
        </div>
      </div>

      <BasicModal title='mi Código QR' show={showQR} onClose={onOpenCloseQR}>
        <IconClose onOpenClose={onOpenCloseQR} />

        {loading ? (
          <Loading size={46} loading={1} />
        ) : isExpired ? (
          <div className={styles.h1QRCaducado}>
            <h1>¡El código QR ha caducado!</h1>
            <ResidenteQR user={user} reload={reload} onReload={onReload} onReloadQR={onReloadQR} />
          </div>
        ) : codigoQR?.qrCode ? (
          <div className={styles.imgQR}>
            <Image src={codigoQR.qrCode} />
          </div>
        ) : (
          <div className={styles.h1QR}>
            <h1>¡Primero tiene que generar el código QR!</h1>
            <ResidenteQR user={user} reload={reload} onReload={onReload} onReloadQR={onReloadQR} />
          </div>
        )}

      </BasicModal>

    </>

  )
}
