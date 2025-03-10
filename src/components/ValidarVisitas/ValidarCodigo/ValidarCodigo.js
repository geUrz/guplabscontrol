import { Button, Input } from 'semantic-ui-react';
import { useState } from 'react';
import axios from 'axios';
import QrScanner from 'react-qr-scanner';
import { BasicModal } from '@/layouts';
import { IconClose, Loading } from '@/components/Layouts';
import { FaEraser, FaQrcode } from 'react-icons/fa';
import { IoIosReverseCamera } from 'react-icons/io';
import { useAuth } from '@/contexts/AuthContext';
import styles from './ValidarCodigo.module.css';
import { useRouter } from 'next/router';

export function ValidarCodigo(props) {
  const { reload, onReload, setVisita, onToastSuccessQRValido } = props;

  const { user } = useAuth()

  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [showCam, setShowCam] = useState(false)
  const [icon, setIcon] = useState(<FaQrcode />)
  const [facingMode, setFacingMode] = useState('environment')
  const [showLoading, setShowLoading] = useState(true)
  const [showScanner, setShowScanner] = useState(false)

  const onOpenCloseCam = () => {
    setShowCam((prevState) => !prevState)
    if (!showCam) {
      setShowLoading(true)
      setShowScanner(false)
      setTimeout(() => {
        setShowLoading(false)
        setShowScanner(true)
      }, 1000)
    }
  };

  const handleChange = (e) => {
    setCodigo(e.target.value)
  };

  const handleConsultar = async (e) => {
    if (e) e.preventDefault()

    try {
      const res = await axios.post('/api/visitas/consultar-codigo', { codigo })
      const visita = res.data.visita;

      if (visita) {
        setResultado(res.data)
        setError(null)
        setVisita(visita)
      } else {
        setResultado(null)
        setError(res.data.message)
        setVisita(null)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al consultar el código')
      setResultado(null)
      setVisita(null)
    }
  };

  const handleValidar = async (e) => {
    if (e) e.preventDefault()

    try {
      const res = await axios.post('/api/visitas/validar-codigo', { codigo, autorizo: user.id })
      if (res.data.visita) {
        setResultado(res.data)
        setError(null)
        setCodigo('')
        setVisita(res.data.visita)
        setIcon(<FaQrcode />)
        onReload()
        onToastSuccessQRValido()
        handleClear()
      } else {
        setError('No se pudo validar el código.')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al validar el código')
      setResultado(null)
      setCodigo('')
      setVisita(null)
      setIcon(<FaQrcode />)
    }
  };

  const handleScan = (data) => {
    if (data) {
      setCodigo(data.text)
      onOpenCloseCam()
    }
  };

  const handleError = (err) => {
    console.error(err)
    setError('Error escaneando el código QR')
  };

  const handleButtonClick = async (e) => {
    e.preventDefault()
    if (resultado && resultado.visita) {
      if (resultado.visita.estado === 'Sin ingresar') {
        await handleValidar()
      } else if (resultado.visita.estado === 'Ingresado' && resultado.visita.tipoacceso === 'frecuente') {
        await handleValidar()
      } else {
        await handleConsultar()
      }
    } else {
      await handleConsultar()
    }
  };

  const handleClear = () => {
    setCodigo('')
    setResultado(null)
    setError(null)
    setVisita(null)
    setIcon(<FaQrcode />)
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'))
  };

  return (
    <>

      <div className={styles.main}>
        <div className={styles.section}>
          <div>
            <Input
              type="text"
              placeholder="Ingresar código"
              value={codigo}
              onChange={handleChange}
            />

            <div className={styles.iconQr} onClick={showCam ? handleClear : onOpenCloseCam}>
              {resultado ? (
                <FaEraser onClick={(e) => { e.stopPropagation(), handleClear() }} />
              ) : (
                icon
              )}
            </div>

          </div>

          {resultado && !resultado.validado && (
            <p className={styles.resultMessage}>
              {resultado.message.split('\n').map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </p>
          )}

          {error && (
            <p className={styles.error}>
              {error.split('\n').map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </p>
          )}

          <Button primary onClick={handleButtonClick}>
            {resultado && resultado.visita && (resultado.visita.estado === 'Sin ingresar' ||
              (resultado.visita.estado === 'Ingresado' && resultado.visita.tipoacceso === 'frecuente'))
              ? 'Validar código'
              : 'Consultar código'}
          </Button>
        </div>

        <BasicModal title='escanear código' show={showCam} onClose={onOpenCloseCam}>
          <IconClose onOpenClose={onOpenCloseCam} />
          <div className={styles.sectionCamera}>
            {showLoading ? (
              <Loading size={45} loading={2} />
            ) : (
              showScanner && (
                <QrScanner
                  delay={0}
                  onError={handleError}
                  onScan={handleScan}
                  className={styles.qrScanner}
                  constraints={{
                    video: { facingMode: facingMode }
                  }}
                />
              )
            )}
            <div className={styles.iconCam} onClick={toggleCamera}>
              <IoIosReverseCamera />
            </div>
          </div>
        </BasicModal>
      </div>
    </>
  )
}
