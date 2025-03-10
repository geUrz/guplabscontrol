import { Button, Form, FormField, FormGroup, Image as ImageUI, Loader, Message } from 'semantic-ui-react';
import { useState } from 'react';
import axios from 'axios';
import styles from './UploadImg.module.css';
import { IconClose } from '../IconClose';

export function UploadImg(props) {
  const { reload, onReload, idKey, itemId, onShowSubirImg, endpoint, onSuccess, selectedImageKey } = props;
  const [fileName, setFileName] = useState('No se ha seleccionado ningún archivo');
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const acceptedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 10 * 5000 * 5000; // 10 MB
  const MAX_WIDTH = 800; // Resolución máxima (ancho)
  const MAX_HEIGHT = 1778; // Resolución máxima (alto)

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!acceptedTypes.includes(file.type)) {
      setError('Tipo de archivo no permitido. Solo se aceptan imágenes jpg, jpeg, png y webp.');
      return;
    }

    // Validar tamaño de archivo
    if (file.size > MAX_FILE_SIZE) {
      setError('El archivo es demasiado grande. Selecciona uno más pequeño.');
      return;
    }

    setError('');
    setFileName(file.name);

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  // Redimensionar la imagen en el cliente
  const resizeImage = (file, callback) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar manteniendo proporción
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(callback, 'image/jpeg', 0.8); // Reducción de calidad al 80%
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    const file = document.querySelector('input[type="file"]').files[0];
    if (!file) return;

    setLoading(true);

    resizeImage(file, async (blob) => {
      const formData = new FormData();
      formData.append('file', blob); // Subir el blob redimensionado
      formData.append('id', itemId);
      formData.append('imageKey', selectedImageKey);

      try {
        const res = await axios.post(`/api/${endpoint}/uploadImage`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const imageUrl = res.data.filePath;
        onSuccess(selectedImageKey, imageUrl);
        onReload();
        onShowSubirImg();
      } catch (error) {
        setError(error.response?.data?.message || 'Error al subir la imagen. Inténtalo de nuevo.');
        console.error('Error al subir la imagen:', error);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <>
      <IconClose onOpenClose={onShowSubirImg} />
      <div className={styles.main}>
        <div className={styles.img}>
          {selectedImage ? <ImageUI src={selectedImage} width="200px" height="200px" /> : ''}
        </div>
        <Form>
          <FormGroup widths="equal">
            <FormField>
              <label htmlFor="file" className="ui icon button">
                <Button as="span" primary>
                  {!selectedImage ? 'Seleccionar imagen' : 'Cambiar imagen'}
                </Button>
              </label>
              <input
                id="file"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageSelect}
              />
              <span>{fileName}</span>
              {error && <Message negative>{error}</Message>}
              <h1>Formatos: jpg, jpeg, png y webp</h1>
              <Button
                onClick={handleImageUpload}
                secondary
                disabled={!selectedImage || loading}
              >
                {loading ? <Loader active inline size="small" /> : 'Subir Imagen'}
              </Button>
            </FormField>
          </FormGroup>
        </Form>
      </div>
    </>
  );
}
