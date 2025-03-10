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

export function QRResidente() {

  const { user } = useAuth()

  const route = useRouter()

  const [showQR, setShowQR] = useState(false)

  const onOpenCloseQR = () => setShowQR((prevState) => !prevState)

  const [codigoQR, setCodigoQR] = useState(null)

  const [loading, setLoading] = useState(true);  // Estado de carga
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  useEffect(() => {

    const timeout = setTimeout(() => {
      setLoadingTimeout(true);
    }, 1200)

    if (showQR && user && user.id) {
      (async () => {
        try {
          const res = await axios.get(`/api/visitas/visitas?residente=${user.id}`)
          const filteredResidenteQR = res.data.filter(residenteQR => residenteQR.tipovisita === 'Residente')
          setCodigoQR(filteredResidenteQR[0])
        } catch (error) {
          console.error(error)
        }
      })()
    } else {
      setCodigoQR(null)
    }

    return () => clearTimeout(timeout)

  }, [showQR, user])

  const linkVisitas = () => {
    route.push('/visitas')
    setShowQR(false)
  }

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
        {loading && !loadingTimeout ? (
          <Loading size={38} loading={2} />
        ) : (
          codigoQR && codigoQR.qrCode ? (
            <div className={styles.imgQR}>
              <Image src={codigoQR.qrCode} />
            </div>
          ) : (
            <div className={styles.h1QR} onClick={linkVisitas}>
              <h1>¡ Primero tiene que generar el código QR desde 'Mis visitas' !</h1>
              <h2>Haga click aquí</h2>
            </div>
          )
        )}
      </BasicModal>

    </>

  )
}
