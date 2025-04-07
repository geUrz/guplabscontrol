import { IconClose, Confirm, Loading, IconEdit, IconDel } from '@/components/Layouts'
import { formatDateIncDet } from '@/helpers'
import { BasicModal, ModalImg } from '@/layouts'
import { FaCheck, FaEdit, FaImage, FaTimes } from 'react-icons/fa'
import { useEffect, useMemo, useState } from 'react'
import { IncidenciaEditForm } from '../IncidenciaEditForm/IncidenciaEditForm'
import axios from 'axios'
import { UploadImg } from '@/components/Layouts/UploadImg'
import styles from './IncidenciaDetalles.module.css'
import { Button, Form, FormField, FormGroup, Image, Input } from 'semantic-ui-react'

export function IncidenciaDetalles(props) {
  const { user, reload, onReload, incidencia: initialIncidencia, onCloseDetalles, onToastSuccessMod, onToastSuccessDel } = props

  const [incidencia, setIncidencia] = useState(initialIncidencia || {})
  const [showEditIncidencia, setShowEditIncidencia] = useState(false)
  const [showSubirImg, setShowSubirImg] = useState(false)
  const [selectedImageKey, setSelectedImageKey] = useState(null)
  const [showImg, setShowImg] = useState(false)
  const [selectedImg, setSelectedImg] = useState(null)
  const [currentTitle, setCurrentTitle] = useState('')
  const [currentTitleKey, setCurrentTitleKey] = useState(null)
  const [showEditTitleModal, setShowEditTitleModal] = useState(false)

  const onOpenEditIncidencia = () => setShowEditIncidencia((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const [imgKeyToDelete, setImgKeyToDelete] = useState(null)

  const openImg = (imgUrl, imgKey) => {
    setSelectedImg(imgUrl)
    setImgKeyToDelete(imgKey)
    setShowImg(true)
  }
  
  const onShowSubirImg = (imgKey) => {
    if (user && user.isadmin === 'Admin' || incidencia.usuario_id === user.id) {
      setSelectedImageKey(imgKey)
      setShowSubirImg(true)     
    }
  }

  const onCloseSubirImg = () => {
    setShowSubirImg(false)
    setSelectedImageKey(null)
  }


  const [showConfirmDelImg, setShowConfirmDelImg] = useState(null)
  const [imageToDelete, setImageToDelete] = useState(null)

  const handleDeleteIncidencia = async () => {
    if (incidencia?.id) {
      try {
        await axios.delete(`/api/incidencias/incidencias?id=${incidencia.id}`)
        setIncidencia(null)
        onReload()
        onToastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la incidencia:', error)
      }
    } else {
      console.error('Incidencia o ID no disponible')
    }
  }

  const handleDeleteImage = async () => {
    try {
      await axios.delete(`/api/incidencias/uploadImage`, {
        params: {
          id: incidencia.id,
          imageKey: imgKeyToDelete,
        },
      })

      setIncidencia((prevIncidencia) => ({
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

  const onShowConfirmDelImg = (imgKey) => {
    setImageToDelete(imgKey)
    setShowConfirmDelImg(true)
  }

  const handleImageUploadSuccess = (imageKey, imageUrl) => {
    setIncidencia({ ...incidencia, [imageKey]: imageUrl })
    setShowSubirImg(false)
  }

  const MAX_TITLE_LENGTH = 60

  const handleTitleChange = (e) => {
    const newTitle = e.target.value || ''
    if (newTitle.length <= MAX_TITLE_LENGTH) {
      setCurrentTitle(newTitle)
    }
  }

  const handleEditTitle = (title, key) => {
    setCurrentTitle(title)
    setCurrentTitleKey(key)
    setShowEditTitleModal(true)
  }

  const handleSaveTitle = async () => {
    try {
      await axios.put(`/api/incidencias/uploadTitle`, {
        id: incidencia.id,
        titleKey: currentTitleKey,
        titleValue: currentTitle,
      })

      setIncidencia((prev) => ({
        ...prev,
        [currentTitleKey]: currentTitle,
      }))

      setShowEditTitleModal(false)
      onReload()
    } catch (error) {
      console.error('Error al guardar el título:', error)
    }
  }

  const imageKeys = ['img1', 'img2', 'img3', 'img4']

  const [incidenciaData, setIncidenciaData] = useState(incidencia)

  useEffect(() => {
    setIncidenciaData(incidencia)
  }, [incidencia])

  const actualizarIncidencia = (nuevaData) => {
    setIncidenciaData((prevState) => ({
      ...prevState,
      ...nuevaData,
    }))
  }

  const permissions = useMemo(() => {

    if (!user) return {}

    return {

      showDatosAdmin: user.isadmin === 'Admin',
      showDatosUser: user.isadmin === 'Admin' || user.id === incidencia.id

    }

  }, [user])

  return (
    <>
      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Incidencia</h1>
              <h2>{incidenciaData?.incidencia}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{incidenciaData?.descripcion}</h2>
            </div>
            <div>
              <h1>Zona</h1>
              <h2>{incidenciaData?.zona}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{incidenciaData?.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDateIncDet(incidenciaData?.createdAt)}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{incidenciaData?.estado}</h2>
            </div>
          </div>
        </div>

        <div className={styles.evidencias}>
          <h1>Evidencias</h1>
          <div className={styles.tabContent}>
            {imageKeys.map(imgKey => (
              <div key={imgKey}>
                {incidencia[imgKey] === null ? (
                  <FaImage onClick={() => onShowSubirImg(imgKey)} />
                ) : (
                  <>
                    <Image src={incidencia[imgKey]} onClick={() => openImg(incidencia[imgKey], imgKey)} />
                    <h1>{incidencia[`title${imageKeys.indexOf(imgKey) + 1}`] || 'Sin título'}</h1>
                    <div className={styles.editTitle} onClick={() => handleEditTitle(incidencia[`title${imageKeys.indexOf(imgKey) + 1}`], `title${imageKeys.indexOf(imgKey) + 1}`)}>
                      {incidencia.usuario_id === user.id || user.isadmin === 'Admin' ?
                        <FaEdit /> : null
                      }
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {permissions.showDatosUser &&
          <IconEdit onOpenEdit={onOpenEditIncidencia} />
        }

        {permissions.showDatosAdmin &&
          <IconDel setShowConfirmDel={onOpenCloseConfirmDel} />
        }

      </div>

      <BasicModal title='Editar incidencia' show={showEditIncidencia} onClose={onOpenEditIncidencia}>
        <IncidenciaEditForm reload={reload} onReload={onReload} incidenciaData={incidenciaData} actualizarIncidencia={actualizarIncidencia} onOpenEditIncidencia={onOpenEditIncidencia} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title='Subir imagen' show={showSubirImg} onClose={onCloseSubirImg}>
        {selectedImageKey && (
          <UploadImg
            reload={reload}
            onReload={onReload}
            itemId={incidencia.id}
            onShowSubirImg={onCloseSubirImg}
            selectedImageKey={selectedImageKey}
            endpoint="incidencias"
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

      <BasicModal title="Título de la imagen" show={showEditTitleModal} onClose={() => setShowEditTitleModal(false)}>
        <div>
          <IconClose onOpenClose={() => setShowEditTitleModal(false)} />

          <Form>
            <FormGroup widths='equal'>
              <FormField>
                <Input
                  type="text"
                  value={currentTitle}
                  onChange={handleTitleChange}
                  placeholder="Título"
                />
              </FormField>
            </FormGroup>
            <div className={styles.caracteres}>
              <h2>{(currentTitle || '').length}/{MAX_TITLE_LENGTH}</h2>
            </div>
            <Button primary onClick={handleSaveTitle}>Guardar</Button>
          </Form>
        </div>
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        onConfirm={handleDeleteIncidencia}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la incidencia ?'
      />

      <Confirm
        open={showConfirmDelImg}
        onConfirm={handleDeleteImage}
        onCancel={() => setShowConfirmDelImg(false)}
        content='¿ Estás seguro de eliminar la imagen ?'
      />

    </>
  )
}
