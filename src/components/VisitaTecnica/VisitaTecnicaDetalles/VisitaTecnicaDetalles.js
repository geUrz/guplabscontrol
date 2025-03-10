import { IconClose, Confirm, UploadImg } from '@/components/Layouts';
import { formatDate } from '@/helpers';
import { BasicModal, ModalImg } from '@/layouts';
import { FaCheck, FaEdit, FaImage, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { VisitaTecnicaEditForm } from '../VisitaTecnicaEditForm/VisitaTecnicaEditForm';
import axios from 'axios';
import { Button, Form, FormField, FormGroup, Image, Input, Tab } from 'semantic-ui-react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './VisitaTecnicaDetalles.module.css';

export function VisitaTecnicaDetalles(props) {
  const {
    reload,
    onReload,
    visitatecnica: initialVisitaTecnica,
    onCloseDetalles,
    onToastSuccessMod,
    onToastSuccessDel,
  } = props

  const { user } = useAuth()
  
  const [visitatecnica, setVisitatecnica] = useState(initialVisitaTecnica || {})
  const [showEditVisitatecnica, setShowEditVisitatecnica] = useState(false)
  const [showSubirImg, setShowSubirImg] = useState(false)
  const [selectedImageKey, setSelectedImageKey] = useState(null)
  const [showImg, setShowImg] = useState(false)
  const [selectedImg, setSelectedImg] = useState(null)
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentTitleKey, setCurrentTitleKey] = useState(null);
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);

  const onOpenEditVisitatecnica = () => setShowEditVisitatecnica((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const [imgKeyToDelete, setImgKeyToDelete] = useState(null);

  const openImg = (imgUrl, imgKey) => {
    setSelectedImg(imgUrl)
    setImgKeyToDelete(imgKey)
    setShowImg(true)
  }

  let onShowSubirImg = () => {}

  if (user.isadmin === 'Admin' || user.isadmin === 'Técnico') {

    onShowSubirImg = (imgKey) => {
      setSelectedImageKey(imgKey)
      setShowSubirImg(true)
    }

  }

  const onCloseSubirImg = () => {
    setShowSubirImg(false); // Cierra el modal
    setSelectedImageKey(null); // Limpia la clave de la imagen seleccionada
  };


  const [showConfirmDelImg, setShowConfirmDelImg] = useState(null)
  const [imageToDelete, setImageToDelete] = useState(null)

  const handleDeleteVisitatecnica = async () => {
    if (visitatecnica?.id) {
      try {
        await axios.delete(`/api/visitatecnica/visitatecnica?id=${visitatecnica.id}`)
        setVisitatecnica(null)
        onReload()
        onToastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la visita tecnica:', error)
      }
    } else {
      console.error('Visita técnica o ID no disponible')
    }
  }

  const handleDeleteImage = async () => {
    try {
      await axios.delete(`/api/visitatecnica/uploadImage`, {
        params: {
          id: visitatecnica.id,
          imageKey: imgKeyToDelete,
        },
      })

      setVisitatecnica ((prevVisitatecnica) => ({
        ...prevVisitatecnica,
        [imgKeyToDelete]: null, // Se establece la clave de la imagen a null
      }));

      onReload(); // Vuelve a cargar los datos
      setShowImg(false); // Cierra el modal de imagen
      setShowConfirmDelImg(false); // Cierra el modal de confirmación
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    }
  }

  const onShowConfirmDelImg = (imgKey) => {
    setImageToDelete(imgKey)
    setShowConfirmDelImg(true)
  }

  const handleImageUploadSuccess = (imageKey, imageUrl) => {
    setVisitatecnica({ ...visitatecnica, [imageKey]: imageUrl });
    setShowSubirImg(false);
  }

  const MAX_TITLE_LENGTH = 40

  const handleTitleChange = (e) => {
    const newTitle = e.target.value || ''
    if (newTitle.length <= MAX_TITLE_LENGTH) {
      setCurrentTitle(newTitle)
    }
  };
  

  const handleEditTitle = (title, key) => {
    setCurrentTitle(title);
    setCurrentTitleKey(key); // Guardamos la clave del título que se está editando
    setShowEditTitleModal(true);
  };

  const handleSaveTitle = async () => {
    try {
      await axios.put(`/api/visitatecnica/uploadTitle`, {
        id: visitatecnica.id,
        titleKey: currentTitleKey,
        titleValue: currentTitle,
      });

      setVisitatecnica((prev) => ({
        ...prev,
        [currentTitleKey]: currentTitle, // Actualizamos el título en el estado
      }));

      setShowEditTitleModal(false);
      onReload();
    } catch (error) {
      console.error('Error al guardar el título:', error);
    }
  }

  const imageKeys1 = ['img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7', 'img8', 'img9', 'img10']
  const imageKeys2 = ['img11', 'img12', 'img13', 'img14', 'img15', 'img16', 'img17', 'img18', 'img19', 'img20']

  const panes = [
    {
      menuItem: 'Antes',
      render: () => (
        <Tab.Pane>
          <div className={styles.tabContent}>
            {imageKeys1.map((imgKey, index) => (
              <div key={imgKey}>
                {visitatecnica[imgKey] === null ? (
                  <FaImage onClick={() => onShowSubirImg(imgKey)} />
                ) : (
                  <>
                    <Image src={visitatecnica[imgKey]} onClick={() => openImg(visitatecnica[imgKey], imgKey)} />
                    <h1>{visitatecnica[`title${index + 1}`] || 'Sin título'}</h1>
                    <div
                      className={styles.editTitle}
                      onClick={() =>
                        handleEditTitle(visitatecnica[`title${index + 1}`], `title${index + 1}`)
                      }
                    >
                      <FaEdit />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Después',
      render: () => (
        <Tab.Pane>
          <div className={styles.tabContent}>
            {imageKeys2.map((imgKey, index) => (
              <div key={imgKey}>
                {visitatecnica[imgKey] === null ? (
                  <FaImage onClick={() => onShowSubirImg(imgKey)} />
                ) : (
                  <>
                    <Image src={visitatecnica[imgKey]} onClick={() => openImg(visitatecnica[imgKey], imgKey)} />
                    <h1>{visitatecnica[`title${index + 11}`] || 'Sin título'}</h1> {/* Usar el índice correctamente */}
                    <div
                      className={styles.editTitle}
                      onClick={() =>
                        handleEditTitle(visitatecnica[`title${index + 11}`], `title${index + 11}`)
                      }
                    >
                      <FaEdit />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Tab.Pane>
      ),
    },
  ]

  return (
    <>
      <IconClose onOpenClose={onCloseDetalles} />
      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Visita técnica</h1>
              <h2>{visitatecnica.visitatecnica}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{visitatecnica.descripcion}</h2>
            </div>
            <div>
              <h1>Técnico</h1>
              <h2>{visitatecnica.usuario_nombre}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{visitatecnica.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDate(visitatecnica.date)}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{visitatecnica.estado}</h2>
            </div>
          </div>
        </div>
        <div className={styles.mainImg}>
          <h1>Evidencias</h1>
          <Tab panes={panes} className={styles.mainTab} />
        </div>

        {user && user.isadmin === 'Admin' || user && user.isadmin === 'Técnico' ? (
          <>
            <div className={styles.iconEdit}>
              <div>
                <FaEdit onClick={onOpenEditVisitatecnica} />
              </div>
            </div>

            {user && user.isadmin === 'Admin' ? (
              <div className={styles.iconDel}>
                <div>
                  <FaTrash onClick={onOpenCloseConfirmDel} />
                </div>
              </div>
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}

      </div>

      <BasicModal title="Modificar la visita técnica" show={showEditVisitatecnica} onClose={onOpenEditVisitatecnica}>
        <VisitaTecnicaEditForm
          reload={reload}
          onReload={onReload}
          visitatecnica={visitatecnica}
          onOpenEditVisitatecnica={onOpenEditVisitatecnica}
          onToastSuccessMod={onToastSuccessMod}
        />
      </BasicModal>

      <BasicModal title="Subir imagen" show={showSubirImg} onClose={onCloseSubirImg}>
        {selectedImageKey && (
          <UploadImg
          reload={reload}
            onReload={onReload}
            itemId={visitatecnica.id}
            onShowSubirImg={onCloseSubirImg}
            selectedImageKey={selectedImageKey}
            endpoint="visitatecnica"
            onSuccess={handleImageUploadSuccess}
      />
        )}
      </BasicModal>

      <BasicModal show={showImg} onClose={() => setShowImg(false)}>
        <ModalImg
          user={user}
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
        onConfirm={handleDeleteVisitatecnica}
        onCancel={onOpenCloseConfirmDel}
        content="¿Estás seguro de eliminar la visita técnica?"
      />

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
    </>
  );
}
