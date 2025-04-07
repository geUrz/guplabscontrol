import { IconClose, Confirm, DatosRes, ToastSuccessQR, UploadImg, IconDel, IconEdit } from '@/components/Layouts'
import { formatDate, formatDateLong, getValueOrDefault } from '@/helpers'
import { BasicModal, ModalImg } from '@/layouts'
import { FaCheck, FaImage, FaInfoCircle, FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import { Tab, Image as ImageSemantic } from 'semantic-ui-react'
import styles from './ReportevisitaDetalles.module.css'
import axios from 'axios'

export function ReportevisitaDetalles(props) {
  const {reload, onReload, reporteVisita: initialVisita, onCloseDetalles, onToastSuccessDel } = props;

  const [reporteVisita, setVisita] = useState(initialVisita)
  const [showRes, setShowRes] = useState(false)
  const [showTipoAcc, setShowTipoAcc] = useState(false)
  const [showDownQR, setShowDownQR] = useState(false)
  const [showImg, setShowImg] = useState(false)
  const [selectedImg, setSelectedImg] = useState(null)

  const onOpenCloseRes = () => setShowRes((prevState) => !prevState)
  const onOpenCloseTipoAcc = () => setShowTipoAcc((prevState) => !prevState)
  const onToastSuccessDownloadQR = () => setShowDownQR((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const openImg = (imgUrl, imgKey) => {
    setSelectedImg(imgUrl)
    setImgKeyToDelete(imgKey)
    setShowImg(true)
  }

  const handleDeleteVisita = async () => {
    if (reporteVisita?.id) {
      try {
        await axios.delete(`/api/reportevisitas/reportevisitas?id=${reporteVisita.id}`)
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
                {reporteVisita[imgKey] === null ? (
                  <FaImage />
                ) : (
                  <ImageSemantic src={reporteVisita[imgKey]} onClick={() => openImg(reporteVisita[imgKey], imgKey)} />
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
                {reporteVisita[imgKey] === null ? (
                  <FaImage />
                ) : (
                  <ImageSemantic src={reporteVisita[imgKey]} onClick={() => openImg(reporteVisita[imgKey], imgKey)} />
                )}
              </div>
            ))}
          </div>
        </Tab.Pane>
      ),
    },
  ]

  const getLastAutorizoValue = (reporteVisita) => {
    const { autorizo_usuario, autorizo_lector, updatedAt } = reporteVisita;

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

    const fechaUsuario = new Date(reporteVisita.autorizo_usuario_updatedAt);
    const fechaLector = new Date(reporteVisita.autorizo_lector_updatedAt);

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
              <h2>{getValueOrDefault(reporteVisita?.visita)}</h2>
            </div>
            <div className={styles.tipoAcc}>
              <h1>Tipo de acceso</h1>
              <div onClick={onOpenCloseTipoAcc}>
                <h2>{getValueOrDefault(reporteVisita?.tipoacceso)}</h2>
                <FaInfoCircle />
              </div>
            </div>
            <div className={styles.reporta}>
              <h1>Residente</h1>
              <div onClick={onOpenCloseRes}>
                <h2>{getValueOrDefault(reporteVisita?.usuario_nombre)}</h2>
                <FaInfoCircle />
              </div>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Tipo de visita</h1>
              <h2>{getValueOrDefault(reporteVisita?.tipovisita)}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{getValueOrDefault(reporteVisita?.estado)}</h2>
            </div>
            <div>
              <h1>Autorizó</h1>
              {
                reporteVisita?.autorizo_usuario === undefined && reporteVisita?.autorizo_lector === undefined ?
                  <h2>Sin ingresar</h2> :
                  <h2>{getLastAutorizoValue(reporteVisita)}</h2>
              }
            </div>
            <div>
              <h1>Acción</h1>
              <h2>{getValueOrDefault(reporteVisita?.action)}</h2>
            </div>
          </div>
        </div>

        {/* <div className={styles.imgMain}>
          <h1>Imágenes</h1>
          <div className={styles.imgContent}>
            <Tab panes={panes} className={styles.mainTab} />
          </div>
        </div> */}

        <div className={styles.actionsBottom}>
          <div className={styles.iconDel}>
            <IconDel setShowConfirmDel={onOpenCloseConfirmDel} />
          </div>
        </div>

        <div className={styles.register}>
          <h1>Visita {reporteVisita.action}</h1>
          <h1>{formatDateLong(reporteVisita.createdAt)}</h1>
        </div>

      </div>

      <BasicModal
        title={
          reporteVisita.tipoacceso === 'frecuente'
            ? 'Días y fecha para accesar'
            : reporteVisita.tipoacceso === 'eventual'
              ? 'Fecha para accesar'
              : ''
        }
        show={showTipoAcc}
        onClose={onOpenCloseTipoAcc}
      >

        <IconClose onOpenClose={onOpenCloseTipoAcc} />
        <div className={styles.diasMain}>
          {reporteVisita?.tipoacceso === 'frecuente' ? (
            <>
              <h1>{getValueOrDefault(reporteVisita?.dias)}</h1>
              <h2>Desde</h2>
              <h3>{formatDate(getValueOrDefault(reporteVisita?.fromDate))}</h3>
              <h2>Hasta</h2>
              <h3>{formatDate(getValueOrDefault(reporteVisita?.toDate))}</h3>
            </>
          ) : reporteVisita?.tipoacceso === 'eventual' ? (
            <h1>{formatDate(getValueOrDefault(reporteVisita?.date))}</h1>
          ) : null}
        </div>
      </BasicModal>


      <BasicModal title='datos de residente' show={showRes} onClose={onOpenCloseRes}>
        <DatosRes
          usuario={getValueOrDefault(reporteVisita?.usuario_nombre)}
          priv={getValueOrDefault(reporteVisita?.usuario_privada)}
          calle={getValueOrDefault(reporteVisita?.usuario_calle)}
          casa={getValueOrDefault(reporteVisita?.usuario_casa)}
          onOpenCloseRes={onOpenCloseRes} />
      </BasicModal>

      <BasicModal show={showImg} onClose={() => setShowImg(false)}>
        <ModalImg
          img={selectedImg}
          openImg={() => setShowImg(false)}
        />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        onConfirm={handleDeleteVisita}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar este reporte ?'
      />

    </>
  )
}