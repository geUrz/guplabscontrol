import { IconClose, Confirm } from '@/components/Layouts';
import { formatDate, convertTo12HourFormat } from '@/helpers';
import { BasicModal, ModalImg } from '@/layouts';
import { FaCheck, FaEdit, FaImage, FaTimes, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { VisitaTecnicaEditForm } from '../OrdenServicioEditForm/OrdenServicioEditForm';
import axios from 'axios';
import { UploadImg } from '@/components/Layouts/UploadImg';
import { Button, Form, Image, Input, Tab } from 'semantic-ui-react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './VisitaTecnicaDetalles.module.css';

export function VisitaTecnicaDetalles(props) {
  const { reload, onReload, visitatecnica: initialVisitaTecnica, onOpenCloseDetalles, onToastSuccessVisitatecnicaMod, onToastSuccessVisitatecnicaDel } = props;
  const { user } = useAuth();

  const [visitatecnica, setVisitatecnica] = useState(initialVisitaTecnica || {})
  const [showEditVisitatecnica, setShowEditVisitatecnica] = useState(false);
  const [showSubirImg, setShowSubirImg] = useState(false);
  const [selectedImageKey, setSelectedImageKey] = useState(null);
  const [showImg, setShowImg] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [showConfirmDel, setShowConfirmDel] = useState(false)
  const [showConfirmDelImg, setShowConfirmDelImg] = useState(false);
  const [imgKeyToDelete, setImgKeyToDelete] = useState(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showEditTitleModal, setShowEditTitleModal] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const onOpenEditVisitatecnica = () => setShowEditVisitatecnica((prevState) => !prevState);

  const openImg = (imgUrl, imgKey) => {
    setSelectedImg(imgUrl);
    setImgKeyToDelete(imgKey);
    setShowImg(true);
  };

  const onShowSubirImg = (imgKey) => {
    setSelectedImageKey(imgKey);
    setShowSubirImg(true);
  };

  const onCloseSubirImg = () => {
    setShowSubirImg(false);
    setSelectedImageKey(null);
  }

  const handleDeleteVisitatecnica = async () => {
    if (visitatecnica?.id) {
      try {
        await axios.delete(`/api/visitatecnica/visitatecnica?id=${visitatecnica.id}`);
        onReload();
        onToastSuccessVisitatecnicaDel();
        onOpenCloseDetalles();
      } catch (error) {
        console.error('Error al eliminar la visita técnica:', error);
      }
    } else {
      console.error('Visita técnica o ID no disponible');
    }
  }

  const handleDeleteImage = async () => {
    try {
      await axios.put(`/api/visitatecnica/updateImage?id=${visitatecnica.id}`, {
        [imgKeyToDelete]: null, // Elimina la imagen
      });
      onReload(); // Recargar los datos después de eliminar
      setShowImg(false); // Cierra el modal de imagen
      setShowConfirmDelImg(false); // Cierra la confirmación de eliminación
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    }
  }

  const handleImageUploadSuccess = (imageKey, imageUrl) => {
    setVisitatecnica((prev) => ({ ...prev, [imageKey]: imageUrl })); // Mantiene otros campos
    setShowSubirImg(false);
  }

  const handleEditTitle = (title, index) => {
    setCurrentTitle(title);
    setCurrentIndex(index);
    setShowEditTitleModal(true);
  };

  const handleSaveTitle = async () => {
    if (currentIndex === null) return;

    const titleKey = `title${currentIndex + 1}`

    try {
        await axios.put(`/api/visitatecnica/uploadTitle`, {
            id: visitatecnica.id,
            titleKey, // La clave del título a actualizar
            titleValue: currentTitle, // El nuevo valor del título
        });
        
        // Actualiza el estado local con el nuevo título
        setVisitatecnica((prev) => ({
            ...prev,
            [titleKey]: currentTitle,
        }));
        setShowEditTitleModal(false);
        onReload(); // Recargar la información si es necesario
    } catch (error) {
        console.error('Error al guardar el título:', error);
    }
};



  const panes = [
    {
      menuItem: 'Antes',
      render: () => (
        <Tab.Pane>
          <div className={styles.tabContent}>
            <div>
              {!visitatecnica.img1 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img1")} />
                </div> :
                <>
                  <Image src={visitatecnica.img1} onClick={() => openImg(visitatecnica.img1, 'img1')} />
                  <h1>{visitatecnica.title1 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title1, 0)} />
                    </div>
                  </div>
                </>
              }
            </div>
            <div>
              {!visitatecnica.img2 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img2")} />
                </div> :
                <>
                  <Image src={visitatecnica.img2} onClick={() => openImg(visitatecnica.img2, 'img2')} />
                  <h1>{visitatecnica.title2 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title2, 1)} />
                    </div>
                  </div>
                </>
              }
            </div>
            <div>
              {!visitatecnica.img3 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img3")} />
                </div> :
                <>
                  <Image src={visitatecnica.img3} onClick={() => openImg(visitatecnica.img3, 'img3')} />
                  <h1>{visitatecnica.title3 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title3, 2)} />
                    </div>
                  </div>
                </>
              }
            </div>
            <div>
              {!visitatecnica.img4 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img4")} />
                </div> :
                <>
                  <Image src={visitatecnica.img4} onClick={() => openImg(visitatecnica.img4, 'img4')} />
                  <h1>{visitatecnica.title4 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title4, 3)} />
                    </div>
                  </div>
                </>
              }
            </div>
            <div>
              {!visitatecnica.img5 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img5")} />
                </div> :
                <>
                  <Image src={visitatecnica.img5} onClick={() => openImg(visitatecnica.img5, 'img5')} />
                  <h1>{visitatecnica.title5 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title5, 4)} />
                    </div>
                  </div>
                </>
              }
            </div>
            <div>
              {!visitatecnica.img6 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img6")} />
                </div> :
                <>
                  <Image src={visitatecnica.img6} onClick={() => openImg(visitatecnica.img6, 'img6')} />
                  <h1>{visitatecnica.title6 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title6, 5)} />
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Después',
      render: () => (
        <Tab.Pane>
          <div className={styles.tabContent}>
            <div>
              {!visitatecnica.img7 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img7")} />
                </div> :
                <>
                  <Image src={visitatecnica.img7} onClick={() => openImg(visitatecnica.img7, 'img7')} />
                  <h1>{visitatecnica.title7 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title7, 6)} />
                    </div>
                  </div>
                </>
              }
            </div>
            <div>
              {!visitatecnica.img8 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img8")} />
                </div> :
                <>
                  <Image src={visitatecnica.img8} onClick={() => openImg(visitatecnica.img8, 'img8')} />
                  <h1>{visitatecnica.title8 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title8, 7)} />
                    </div>
                  </div>
                </>
              }
            </div>
            <div>
              {!visitatecnica.img9 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img9")} />
                </div> :
                <>
                  <Image src={visitatecnica.img9} onClick={() => openImg(visitatecnica.img9, 'img9')} />
                  <h1>{visitatecnica.title9 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title9, 8)} />
                    </div>
                  </div>
                </>
              }
            </div>
            <div>
              {!visitatecnica.img10 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img10")} />
                </div> :
                <>
                  <Image src={visitatecnica.img10} onClick={() => openImg(visitatecnica.img10, 'img10')} />
                  <h1>{visitatecnica.title10 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title10, 9)} />
                    </div>
                  </div>
                </>
              }
            </div>
            <div>
              {!visitatecnica.img11 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img11")} />
                </div> :
                <>
                  <Image src={visitatecnica.img11} onClick={() => openImg(visitatecnica.img11, 'img11')} />
                  <h1>{visitatecnica.title11 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title11, 10)} />
                    </div>
                  </div>
                </>
              }
            </div>
            <div>
              {!visitatecnica.img12 ?
                <div className={styles.faImage}>
                  <FaImage onClick={() => onShowSubirImg("img12")} />
                </div> :
                <>
                  <Image src={visitatecnica.img12} onClick={() => openImg(visitatecnica.img12, 'img12')} />
                  <h1>{visitatecnica.title12 || 'sin titulo'}</h1>
                  <div className={styles.editTitle}>
                    <div>
                      <FaEdit onClick={() => handleEditTitle(visitatecnica.title12, 11)} />
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      <IconClose onOpenClose={onOpenCloseDetalles} />

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
            <div>
              <h1>Estatus</h1>
              <h2>{visitatecnica.estado}</h2>
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
              <h1>Hora</h1>
              <h2>{convertTo12HourFormat(visitatecnica.hora)}</h2>
            </div>
          </div>
        </div>

        <div className={styles.mainImg}>
          <h1>Evidencias de la visita técnica</h1>
          <Tab panes={panes} className={styles.mainTab} />
        </div>

        {user.isadmin === 'Admin' || visitatecnica.usuario_id === user.id ? (
          <>
            <div className={styles.iconEdit}>
              <FaEdit onClick={onOpenEditVisitatecnica} />
            </div>
            {user.isadmin === 'Admin' && (
              <div className={styles.iconDel}>
                <FaTrash onClick={() => setShowConfirmDel(true)} />
              </div>
            )}
          </>
        ) : null}
      </div>

      <BasicModal title="Modificar la visita técnica" show={showEditVisitatecnica} onClose={onOpenEditVisitatecnica}>
        <VisitaTecnicaEditForm
          reload={reload}
          onReload={onReload}
          visitatecnica={visitatecnica}
          onOpenEditVisitatecnica={onOpenEditVisitatecnica}
          onToastSuccessVisitatecnicaMod={onToastSuccessVisitatecnicaMod}
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
          img={selectedImg}
          openImg={() => setShowImg(false)}
          onShowConfirmDelImg={() => setShowConfirmDelImg(true)}
          imgKey={imgKeyToDelete}
        />
      </BasicModal>

      <BasicModal title='Título' show={showEditTitleModal} onClose={() => setShowEditTitleModal(false)}>
        <IconClose onOpenClose={() => setShowEditTitleModal(false)} />
        <Form>
          <Input
            type="text"
            value={currentTitle || ''}
            onChange={(e) => setCurrentTitle(e.target.value)}
            placeholder="Ingrese el título"
          />
          <Button primary onClick={handleSaveTitle}>
            Guardar
          </Button>
        </Form>
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
        content='¿ Estas seguro de eliminar la visita técnica ?'
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
