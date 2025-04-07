import { IconClose, Confirm, DatosRes, ToastSuccessQR, UploadImg, IconDel, IconEdit } from '@/components/Layouts'
import { formatDate, getValueOrDefault } from '@/helpers'
import { BasicModal, ModalImg } from '@/layouts'
import { FaCheck, FaDownload, FaEdit, FaImage, FaInfoCircle, FaShareAlt, FaTimes, FaTrash } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { VisitaEditForm } from '../VisitaEditForm/VisitaEditForm'
import axios from 'axios'
import { Tab, Image as ImageSemantic } from 'semantic-ui-react'
import styles from './VisitaDetalles.module.css'

export function VisitaDetalles(props) {
  const { user, reload, onReload, visita: initialVisita, onCloseDetalles, onToastSuccessMod, onToastSuccessDel } = props;

  const [visita, setVisita] = useState(initialVisita)
  const [showEditVisita, setShowEditVisita] = useState(false)
  const [showRes, setShowRes] = useState(false)
  const [showTipoAcc, setShowTipoAcc] = useState(false)
  const [showConfirmDel, setShowConfirmDel] = useState(false)
  const [showDownQR, setShowDownQR] = useState(false)
  const [showImg, setShowImg] = useState(false)
  const [selectedImg, setSelectedImg] = useState(null)
  const [selectedImageKey, setSelectedImageKey] = useState(null)
  const [showSubirImg, setShowSubirImg] = useState(false)

  const onOpenEditVisita = () => setShowEditVisita((prevState) => !prevState)
  const onOpenCloseRes = () => setShowRes((prevState) => !prevState)
  const onOpenCloseTipoAcc = () => setShowTipoAcc((prevState) => !prevState)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)
  const onToastSuccessDownloadQR = () => setShowDownQR((prevState) => !prevState)

  const [showConfirmDelImg, setShowConfirmDelImg] = useState(false)
  const [imgKeyToDelete, setImgKeyToDelete] = useState(null)

  const openImg = (imgUrl, imgKey) => {
    setSelectedImg(imgUrl)
    setImgKeyToDelete(imgKey)
    setShowImg(true)
  }

  const onShowSubirImg = (imgKey) => {
    if(user && user.isadmin === 'Admin' || user.isadmin === 'Caseta'){
      setSelectedImageKey(imgKey)
      setShowSubirImg(true)
    }
  }

  const onCloseSubirImg = () => {
    setShowSubirImg(false)
    setSelectedImageKey(null)
  }

  const handleImageUploadSuccess = (imageKey, imageUrl) => {
    setVisita({ ...visita, [imageKey]: imageUrl })
    setShowSubirImg(false)
  }

  const onShowConfirmDelImg = (imgKey) => {
    setImageToDelete(imgKey)
    setShowConfirmDelImg(true)
  }

  const handleDeleteVisita = async () => {
    if (visita?.id) {
      try {
        await axios.delete(`/api/visitas/visitas?id=${visita.id}`)
        onReload()
        onToastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la visita:', error)
      }
    } else {
      console.error('Visita o ID no disponible')
    }
  }

  const handleDeleteImage = async () => {
    try {
      await axios.delete(`/api/visitas/uploadImage`, {
        params: {
          id: visita.id,
          imageKey: imgKeyToDelete,
        },
      })

      setVisita((prevIncidencia) => ({
        ...prevIncidencia,
        [imgKeyToDelete]: null, 
      }))

      onReload() 
      setShowImg(false)
      setShowConfirmDelImg(false)
    } catch (error) {
      console.error('Error al eliminar la imagen:', error)
    }
  }

  const handleDownloadQRCode = async () => {
    if (!visita || !visita.qrCode) {
      console.error('El objeto visita o qrCode no está definido')
      return;
    }

    try {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = visita.qrCode;

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          console.error('El contexto del canvas no está disponible')
          return;
        }

        const qrCodeSize = 300
        const textHeight = 60 
        const additionalTextHeight = 60 
        const width = qrCodeSize;
        const height = qrCodeSize + textHeight + additionalTextHeight

        canvas.width = width;
        canvas.height = height

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)

        const headerText = 'Código de acceso\n' +
          `${visita.codigo}`

        ctx.font = '18px Calibri' 
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center' 
        ctx.textBaseline = 'top' 

        const lines = headerText.split('\n')
        const lineHeight = 25
        let textY = 25

        lines.forEach((line) => {
          ctx.fillText(line, width / 2, textY) 
          textY += lineHeight 
        })

        const qrY = 70 

        ctx.drawImage(img, 0, qrY, qrCodeSize, qrCodeSize)

        const usuarioPrivada = visita.usuario_privada !== null ? visita.usuario_privada : ''
        const usuarioCalle = visita.usuario_calle !== null ? visita.usuario_calle : ''
        const usuarioCasa = visita.usuario_casa && visita.usuario_casa !== '0' ? `#${visita.usuario_casa}` : ''

        const additionalText = `${visita.usuario_nombre}\n` +
          `${usuarioPrivada} ${usuarioCalle} ${usuarioCasa}`

        ctx.font = '18px Calibri' 
        const additionalLines = additionalText.split('\n')
        const additionalLineHeight = 20 
        let additionalTextY = 5 + qrCodeSize + 60 

        additionalLines.forEach((line) => {
          ctx.fillText(line, width / 2, additionalTextY) 
          additionalTextY += additionalLineHeight 
        })

        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `qrCode_${usuarioCalle}_${usuarioCasa}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      img.onerror = (error) => {
        console.error('Error al cargar la imagen QR Code', error)
      }

      onToastSuccessDownloadQR()
    } catch (error) {
      console.error('Error al descargar la imagen QR Code:', error)
    }
  }

  const handleShare = async () => {
    if (!visita || !visita.qrCode) {
      console.error('El objeto visita o qrCode no está definido')
      return;
    }

    if (!navigator.share) {
      console.error('La API de Web Share no está soportada en este navegador')
      return;
    }

    try {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = visita.qrCode;

      img.onload = async () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const qrCodeSize = 300
        const textHeight = 60
        const additionalTextHeight = 60
        const width = qrCodeSize;
        const height = qrCodeSize + textHeight + additionalTextHeight

        canvas.width = width
        canvas.height = height

        // Fondo blanco
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)

        // Texto encima del QR
        const headerText = 'Código de acceso\n' +
          `${visita.codigo}`
        ctx.font = '18px Calibri'
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'

        const lines = headerText.split('\n')
        const lineHeight = 25;
        let textY = 25;

        lines.forEach((line) => {
          ctx.fillText(line, width / 2, textY)
          textY += lineHeight
        })

        const qrY = 70
        ctx.drawImage(img, 0, qrY, qrCodeSize, qrCodeSize)

        const usuarioPrivada = visita.usuario_privada !== null ? visita.usuario_privada : ''
        const usuarioCalle = visita.usuario_calle !== null ? visita.usuario_calle : ''
        const usuarioCasa = visita.usuario_casa && visita.usuario_casa !== '0' ? `#${visita.usuario_casa}` : ''

        // Texto que va debajo del código QR
        const additionalText = `${visita.usuario_nombre}\n` +
          `${usuarioPrivada} ${usuarioCalle} ${usuarioCasa}`

        const additionalLines = additionalText.split('\n')
        const additionalLineHeight = 20
        let additionalTextY = 5 + qrCodeSize + 60

        additionalLines.forEach((line) => {
          ctx.fillText(line, width / 2, additionalTextY)
          additionalTextY += additionalLineHeight
        })

        // Convertir el canvas en un archivo blob para compartir
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `qrCode_${usuarioCalle}_${usuarioCasa}.png`, { type: 'image/png' })

          if (navigator.share) {
            try {
              await navigator.share({
                title: 'Código QR de acceso',
                text: `Nombre de la visita: ${visita.visita}\nCódigo de acceso: ${visita.codigo}`,
                files: [file], // Compartir el archivo con datos adicionales
              })
              console.log('QR compartido exitosamente')
            } catch (error) {
              console.error('Error al compartir el QR:', error)
            }
          } else {
            console.error('La API de Web Share no está soportada en este navegador')
          }
        })
      }

      img.onerror = (error) => {
        console.error('Error al cargar la imagen QR Code para compartir', error)
      }
    } catch (error) {
      console.error('Error al compartir el QR:', error)
    }
  }

  const imageKeys1 = ['img1', 'img2', 'img3']
  const imageKeys2 = ['img4', 'img5', 'img6', 'img7']

  const panes = [
    {
      menuItem: 'Lector QR',
      render: () => (
        <Tab.Pane>
          <div className={styles.tabContent1}>
            {imageKeys1.map((imgKey) => (
              <div key={imgKey}>
                {visita[imgKey] === null ? (
                  <FaImage />
                ) : (
                  <ImageSemantic src={visita[imgKey]} onClick={() => openImg(visita[imgKey], imgKey)} />
                )}
              </div>
            ))}
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Caseta',
      render: () => (
        <Tab.Pane>
          <div className={styles.tabContent2}>
            {imageKeys2.map((imgKey) => (
              <div key={imgKey}>
                {visita[imgKey] === null ? (
                  <FaImage onClick={() => onShowSubirImg(imgKey)} />
                ) : (
                  <ImageSemantic src={visita[imgKey]} onClick={() => openImg(visita[imgKey], imgKey)} />
                )}
              </div>
            ))}
          </div>
        </Tab.Pane>
      ),
    },
  ]

  const [visitaData, setVisitaData] = useState(visita)

  useEffect(() => {
    setVisitaData(visita)
  }, [visita])

  const actualizarVisita = (nuevaData) => {
    setVisitaData((prevState) => ({
      ...prevState,
      ...nuevaData,
    }))
  }

  const getLastAutorizoValue = (visitaData) => {
    const { autorizo_usuario, autorizo_lector, updatedAt } = visitaData;

    if (!autorizo_usuario && !autorizo_lector) {
      return 'Sin ingresar'
    }

    if (!autorizo_usuario) {
      return autorizo_lector || 'Sin ingresar';
    }
    if (!autorizo_lector) {
      return autorizo_usuario || 'Sin ingresar';
    }

    const fechaUltimaActualizacion = new Date(updatedAt || createdAt)

    const fechaUsuario = new Date(visitaData.autorizo_usuario_updatedAt);
    const fechaLector = new Date(visitaData.autorizo_lector_updatedAt);

    if (fechaUsuario > fechaLector) {
      return autorizo_usuario;
    }

    return autorizo_lector;
  }

  return (
    <>
      {showDownQR && <ToastSuccessQR onToastSuccessDownloadQR={onToastSuccessDownloadQR} />}

      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Nombre de la visita</h1>
              <h2>{getValueOrDefault(visitaData?.visita)}</h2>
            </div>
            <div className={styles.tipoAcc}>
              <h1>Tipo de acceso</h1>
              <div onClick={onOpenCloseTipoAcc}>
                <h2>{getValueOrDefault(visitaData?.tipoacceso)}</h2>
                <FaInfoCircle />
              </div>
            </div>
            <div className={styles.reporta}>
              <h1>Residente</h1>
              <div onClick={onOpenCloseRes}>
                <h2>{getValueOrDefault(visitaData?.usuario_nombre)}</h2>
                <FaInfoCircle />
              </div>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Tipo de visita</h1>
              <h2>{getValueOrDefault(visitaData?.tipovisita)}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{getValueOrDefault(visitaData?.estado)}</h2>
            </div>
            <div>
              <h1>Autorizó</h1>
              {
                visitaData?.autorizo_usuario === undefined && visitaData?.autorizo_lector === undefined ?
                  <h2>Sin ingresar</h2> :
                  <h2>{getLastAutorizoValue(visitaData)}</h2>
              }
            </div>
          </div>
        </div>

        <div className={styles.imgMain}>
          <h1>Imágenes</h1>
          <div className={styles.imgContent}>
            <Tab panes={panes} className={styles.mainTab} />
          </div>
        </div>

        <div className={styles.codigo}>
          <h1>Código de acceso</h1>
          <h2>{getValueOrDefault(visitaData?.codigo)}</h2>
          {visita.qrCode && (
            <ImageSemantic src={visita.qrCode} />
          )}
        </div>

        {user && user.isadmin === 'Admin' || user && visita.usuario_id === user.id ? (
          <>
            <IconEdit onOpenEdit={onOpenEditVisita} />

            <div className={styles.actionsBottom}>
              <div>
                <div className={styles.iconDown}>
                  <FaDownload onClick={handleDownloadQRCode} />
                </div>
                <div className={styles.iconShare}>
                  <FaShareAlt onClick={handleShare} />
                </div>
              </div>
              <div className={styles.iconDel}>
                <IconDel setShowConfirmDel={onOpenCloseConfirmDel} />
              </div>
            </div>
          </>
        ) : null}
      </div>

      <BasicModal title='Editar visita' show={showEditVisita} onClose={onOpenEditVisita}>
        <VisitaEditForm user={user} reload={reload} onReload={onReload} visitaData={visitaData} actualizarVisita={actualizarVisita} onOpenEditVisita={onOpenEditVisita} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal
        title={
          visita.tipoacceso === 'frecuente'
            ? 'Días y fecha para accesar'
            : visita.tipoacceso === 'eventual'
              ? 'Fecha para accesar'
              : ''
        }
        show={showTipoAcc}
        onClose={onOpenCloseTipoAcc}
      >

        <IconClose onOpenClose={onOpenCloseTipoAcc} />
        <div className={styles.diasMain}>
          {visitaData?.tipoacceso === 'frecuente' ? (
            <>
              <h1>{getValueOrDefault(visitaData?.dias)}</h1>
              <h2>Desde</h2>
              <h3>{formatDate(getValueOrDefault(visitaData?.fromDate))}</h3>
              <h2>Hasta</h2>
              <h3>{formatDate(getValueOrDefault(visitaData?.toDate))}</h3>
            </>
          ) : visitaData?.tipoacceso === 'eventual' ? (
            <h1>{formatDate(getValueOrDefault(visitaData?.date))}</h1>
          ) : null}
        </div>
      </BasicModal>


      <BasicModal title='datos de residente' show={showRes} onClose={onOpenCloseRes}>
        <DatosRes
          usuario={getValueOrDefault(visitaData?.usuario_nombre)}
          priv={getValueOrDefault(visitaData?.usuario_privada)}
          calle={getValueOrDefault(visitaData?.usuario_calle)}
          casa={getValueOrDefault(visitaData?.usuario_casa)}
          onOpenCloseRes={onOpenCloseRes} />
      </BasicModal>

      <BasicModal show={showImg} onClose={() => setShowImg(false)}>
        <ModalImg
          img={selectedImg}
          openImg={() => setShowImg(false)}
          onShowConfirmDelImg={() => onShowConfirmDelImg(imgKeyToDelete)}
          imgKey={imgKeyToDelete}
        />
      </BasicModal>

      <BasicModal title="Subir imagen" show={showSubirImg} onClose={onCloseSubirImg}>
        {selectedImageKey && (
          <UploadImg
            reload={reload}
            onReload={onReload}
            itemId={visita.id}
            onShowSubirImg={onCloseSubirImg}
            selectedImageKey={selectedImageKey}
            endpoint="visitas"
            onSuccess={handleImageUploadSuccess}
          />
        )}
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        onConfirm={handleDeleteVisita}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la visita ?'
      />

      <Confirm
        open={showConfirmDelImg}
        onConfirm={handleDeleteImage}
        onCancel={() => setShowConfirmDelImg(false)}
        content="¿Estás seguro de eliminar la imagen?"
      />
    </>
  )
}