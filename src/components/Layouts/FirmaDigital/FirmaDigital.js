import { useRef, useEffect, useState } from 'react'
import SignaturePad from 'react-signature-canvas'
import styles from './FirmaDigital.module.css'
import { Button } from 'semantic-ui-react'
import { IconClose } from '../IconClose'
import axios from 'axios'

export function FirmaDigital(props) {
  const { reload, onReload, endPoint, tipoFirma, itemId, onOpenClose } = props

  const [trimmedDataURL, setTrimmedDataURL] = useState(null)
  const sigPad = useRef(null)

  useEffect(() => {
    const canvas = sigPad.current?.getCanvas()
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
    }
  }, [])

  const clear = () => {
    sigPad.current.clear()
  };

  const trim = async () => {
    const signature = sigPad.current.getTrimmedCanvas().toDataURL('image/png')
    setTrimmedDataURL(signature)
    await onSave(signature)
  }

  const onSave = async (signature) => {
    try {
      // Determinar el endpoint según el tipo de firma
      const endpoint = tipoFirma === 'firmatec' 
        ? `/api/${endPoint}/createFirmaTec` 
        : `/api/${endPoint}/createFirmaCli`;
  
      const response = await axios.put(endpoint, {
        id: `${itemId}`,
        firmaValue: signature
      });
  
      if (response.status === 200) {
        console.log('Firma guardada exitosamente');
        onReload();  // Llamar la función para recargar el estado en el componente principal
        onOpenClose();  // Cerrar el modal de firma
      }
    } catch (error) {
      console.error('Error al guardar la firma:', error);
    }
  }
  

  return (
    <>
      <IconClose onOpenClose={onOpenClose} />
      <div className={styles.signatureContainer}>
        <SignaturePad
          ref={sigPad}
          penColor='#007785'
          minWidth={1}
          maxWidth={1}
          canvasProps={{ className: styles.signatureCanvas }} />
        <div className={styles.controls}>
          <Button secondary onClick={clear}>Limpiar</Button>
          <Button primary onClick={trim}>Firmar</Button>
        </div>
      </div>
    </>
  )
}
