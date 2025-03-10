import { size } from 'lodash';
import styles from './DatosCodigo.module.css';
import { Image } from 'semantic-ui-react';
import { FaCheck, FaImage, FaTimes, FaTrash } from 'react-icons/fa';
import { BasicModal, ModalImg } from '@/layouts';
import { Confirm, UploadImg } from '@/components/Layouts';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function DatosCodigo(props) {
  const { visita: initialVisita, reload, onReload } = props

  const [visita, setVisita] = useState(initialVisita)

  useEffect(() => {
    setVisita(initialVisita)
  }, [initialVisita])

  const [showSubirImg, setShowSubirImg] = useState(false)
  const [selectedImageKey, setSelectedImageKey] = useState(null)
  const [showImg, setShowImg] = useState(false)
  const [selectedImg, setSelectedImg] = useState(null)

  const [showConfirmDelImg, setShowConfirmDelImg] = useState(false)
  const [imageToDelete, setImageToDelete] = useState(null)
  const [imgKeyToDelete, setImgKeyToDelete] = useState(null)

  const openImg = (imgUrl, imgKey) => {
    setSelectedImg(imgUrl)
    setImgKeyToDelete(imgKey)
    setShowImg(true)
  }

  const onShowSubirImg = (imgKey) => {
    setSelectedImageKey(imgKey)
    setShowSubirImg(true)
  }

  const onCloseSubirImg = () => {
    setShowSubirImg(false)
    setSelectedImageKey(null)
  }

  const handleDeleteImage = async () => {
    try {
      // Realiza la solicitud de eliminación de la imagen en el backend
      await axios.delete(`/api/visitas/uploadImage`, {
        params: {
          id: visita.id,
          imageKey: imgKeyToDelete,
        },
      })

      // Actualiza el estado de la visita después de eliminar la imagen
      setVisita((prevIncidencia) => ({
        ...prevIncidencia,
        [imgKeyToDelete]: null, // Se establece la clave de la imagen a null
      }))

      onReload() // Recarga los datos
      setShowImg(false) // Cierra el modal de imagen
      setShowConfirmDelImg(false) // Cierra el modal de confirmación
    } catch (error) {
      console.error('Error al eliminar la imagen:', error)
    }
  }

  const onShowConfirmDelImg = (imgKey) => {
    setImageToDelete(imgKey)
    setShowConfirmDelImg(true)
  }

  const handleImageUploadSuccess = (imageKey, imageUrl) => {
    setVisita({ ...visita, [imageKey]: imageUrl })
    setShowSubirImg(false)
  }

  const imageKeys = ['img1', 'img2', 'img3', 'img4']
  
  return (
    <div className={styles.main}>
      <div className={styles.section}>
        <h1>Datos del código</h1>

        {size(visita) === 0 ? (
          ''
        ) : (
          <>
            <div className={styles.datos}>
              <div className={styles.datos_1}>
                <div>
                  <h2>Residente</h2>
                  <h3>{visita.usuario_nombre}</h3>
                </div>
                <div>
                  <h2>Visita</h2>
                  <h3>{visita.visita}</h3>
                </div>
                <div>
                  <h2>Calle</h2>
                  <h3>{visita.usuario_calle}</h3>
                </div>
                <div>
                  <h2>Tipo de visita</h2>
                  <h3>{visita.tipovisita}</h3>
                </div>
              </div>
              <div className={styles.datos_2}>
                <div>
                  <h2>Código</h2>
                  <h3>{visita.codigo}</h3>
                </div>
                <div>
                  <h2>Privada</h2>
                  <h3>{visita.usuario_privada}</h3>
                </div>
                <div>
                  <h2>Casa</h2>
                  <h3>#{visita.usuario_casa}</h3>
                </div>
                <div className={styles.tipoAcc}>
                  <h2>Tipo de acceso</h2>
                  <h3>{visita.tipoacceso}</h3>
                </div>
              </div>
            </div>

              <div className={styles.imgContent}>
                {imageKeys.map(imgKey => (
                  <div key={imgKey}>
                    {visita[imgKey] === null ? (
                      <FaImage onClick={() => onShowSubirImg(imgKey)} />
                    ) : (
                      <Image src={visita[imgKey]} onClick={() => openImg(visita[imgKey], imgKey)} />
                    )}
                  </div>
                ))}
              </div>
          </>
        )}
      </div>

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

      <BasicModal show={showImg} onClose={() => setShowImg(false)}>
        <ModalImg
          img={selectedImg}
          openImg={() => setShowImg(false)}
          onShowConfirmDelImg={() => onShowConfirmDelImg(imgKeyToDelete)}
          imgKey={imgKeyToDelete}
        />
      </BasicModal>

      <Confirm
        open={showConfirmDelImg}
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
        onConfirm={handleDeleteImage}
        onCancel={() => setShowConfirmDelImg(false)}
        content="¿Estás seguro de eliminar la imagen?"
      />
    </div>
  )
}
