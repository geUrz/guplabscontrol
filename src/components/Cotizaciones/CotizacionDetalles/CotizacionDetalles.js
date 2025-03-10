import { Confirm, IconClose, ToastSuccess } from '@/components/Layouts'
import { FaCheck, FaEdit, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { formatCurrency, formatDateIncDet } from '@/helpers'
import { BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { CotizacionConceptos } from '../CotizacionConceptos'
import { CotizacionPDF } from '../CotizacionPDF'
import { CotizacionConceptosForm } from '../CotizacionConceptosForm'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, TextArea } from 'semantic-ui-react'
import { RowHeadModal } from '../RowHead'
import { CotizacionEditForm } from '../CotizacionEditForm'
import { CotizacionConceptosEditForm } from '../CotizacionConceptosEditForm'
import styles from './CotizacionDetalles.module.css'

export function CotizacionDetalles(props) {

  const { cotizacion, cotizacionId, reload, onReload, onOpenClose, onAddConcept, onDeleteConcept, onShowConfirm, onToastSuccess, onToastSuccessMod, onToastSuccessDel, cotizacionSeleccionado } = props

  const [showConcep, setShowForm] = useState(false)
  const [showEditConcep, setShowEditConcept] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)

  const [showEditRecibo, setShowEditRecibo] = useState(false)
  const onOpenEditCotizacion = () => setShowEditRecibo((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  useEffect(() => {
    setEditNota(!!(cotizacion && cotizacion.nota));
  }, [cotizacion?.nota])

  /* const onOpenCloseConfirm = (concepto) => {
    setShowConfirm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  } */

  const onOpenCloseConfirm = (concepto) => {
    if (!concepto || !concepto.id) {
      console.error('Concepto no válido:', concepto);
      return;
    }
    setShowConfirm((prevState) => !prevState);
    setCurrentConcept(concepto.id);
  }


  const onOpenCloseConcep = (concepto) => {
    setShowForm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const onOpenCloseEditConcep = (concepto) => {
    setShowEditConcept((prevState) => !prevState)
    setCurrentConcept(concepto)
  }

  const handleDeleteConcept = () => {
    onDeleteConcept(currentConcept)
    setShowConfirm(false)
    setShowEditConcept(false)
  }

  const [toggleIVA, setToggleIVA] = useState(false)

  const onIVA = () => {
    setToggleIVA((prevState) => !prevState)
  }

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA));
  }, [toggleIVA])

  const subtotal = (cotizacion?.conceptos || []).reduce(
    (sum, concepto) => sum + concepto.precio * concepto.cantidad,
    0
  )
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const [nota, setNota] = useState(cotizacion?.nota || '')
  const [editNota, setEditNota] = useState(!!cotizacion?.nota)

  const maxCharacters = 280

  const handleNotaChange = (e) => {
    const { value } = e.target;
    if (value.length <= maxCharacters) {
      setNota(value);
    }
  };

  const handleAddNota = async () => {
    if (!cotizacion.id) {
      console.error("ID de la cotización no disponible");
      return;
    }

    try {
      const response = await axios.put(`/api/cotizaciones/nota`, {
        id: cotizacion.id,
        notaValue: nota,
      });

      if (response.status === 200) {
        setEditNota(true);
        onReload();
      }
    } catch (error) {
      console.error('Error al actualizar la nota:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (cotizacion?.nota !== undefined) {
      setEditNota(!!cotizacion?.nota);
    }
  }, [cotizacion?.nota]);

  const handleDelete = async () => {
    if (!cotizacion?.id) {
      console.error("Cotización o ID no disponible");
      return;
    }

    try {
      await axios.delete(`/api/cotizaciones/cotizaciones?id=${cotizacion.id}`);
      onOpenClose()
      cotizacionSeleccionado(null)
      onReload()
      onToastSuccessDel()
    } catch (error) {
      console.error("Error al eliminar la cotización:", error)
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      {toastSuccess && <ToastSuccess contain='Concepto agregado exitosamente' onClose={() => setToastSuccess(false)} />}

      <div className={styles.main}>
        <div className={styles.sectionDatos}>
          <div className={styles.datos_1}>
            <div>
              <h1>Cotización</h1>
              <h2>{cotizacion.cotizacion}</h2>
            </div>
          </div>
          <div className={styles.datos_2}>
            <div>
              <h1>Folio</h1>
              <h2>{cotizacion?.folio || 'No disponible'}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDateIncDet(cotizacion?.createdAt) || 'No disponible'}</h2>
            </div>
          </div>
        </div>

        <RowHeadModal rowMain />

        <CotizacionConceptos conceptos={cotizacion?.conceptos || []} onOpenCloseConfirm={onOpenCloseConfirm} onOpenCloseEditConcep={onOpenCloseEditConcep} handleDeleteConcept={handleDeleteConcept} />

        <div className={styles.iconPlus}>
          <div onClick={onOpenCloseConcep}>
            <FaPlus />
          </div>
        </div>

        <div className={styles.sectionTotal}>
          <div className={styles.sectionTotal_1}>
            <h1>Subtotal:</h1>

            {!toggleIVA ? (

              <div className={styles.toggleOFF}>
                <BiSolidToggleLeft onClick={onIVA} />
                <h1>IVA:</h1>
              </div>

            ) : (

              <div className={styles.toggleON}>
                <BiSolidToggleRight onClick={onIVA} />
                <h1>IVA:</h1>
              </div>

            )}

            <h1>Total:</h1>
          </div>

          <div className={styles.sectionTotal_2}>

            {!toggleIVA ? (
              <>

                <h1>-</h1>
                <h1>-</h1>

              </>
            ) : (
              <>

                <h1>${formatCurrency(subtotal)}</h1>
                <h1>${formatCurrency(iva)}</h1>

              </>
            )}

            {!toggleIVA ? (
              <h1>${formatCurrency(subtotal)}</h1>
            ) : (
              <h1>${formatCurrency(total)}</h1>
            )}

          </div>
        </div>

        <div className={styles.toggleNota}>
          <h1>Nota</h1>
        </div>

        <div className={styles.formNota}>
          <Form>
            <FormGroup>
              <FormField>
                <TextArea
                  value={nota}
                  onChange={handleNotaChange}
                  placeholder="Escribe una nota aquí..."
                />
                <div className={styles.charCount}>
                  {nota.length}/{maxCharacters}
                </div>
              </FormField>
            </FormGroup>
            <Button secondary onClick={handleAddNota}>
              {editNota ? 'Modificar nota' : 'Añadir nota'}
            </Button>
          </Form>
        </div>

        <div className={styles.iconEdit}>
          <div><FaEdit onClick={onOpenEditCotizacion} /></div>
        </div>
        <div className={styles.iconDel}>
          <div><FaTrash onClick={() => setShowConfirmDel(true)} /></div>
        </div>

        <CotizacionPDF cotizacion={cotizacion} conceptos={cotizacion?.conceptos || []} />

      </div>

      <BasicModal title='modificar la cotización' show={showEditRecibo} onClose={onOpenEditCotizacion}>
        <CotizacionEditForm reload={reload} onReload={onReload} cotizacion={cotizacion} onOpenEditCotizacion={onOpenEditCotizacion} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title='Agregar concepto' show={showConcep} onClose={onOpenCloseConcep}>
        <CotizacionConceptosForm reload={reload} onReload={onReload} onOpenCloseConcep={onOpenCloseConcep} onAddConcept={onAddConcept} cotizacionId={cotizacionId?.id || []} onToastSuccess={onToastSuccess} />
      </BasicModal>

      <BasicModal title='Modificar concepto' show={showEditConcep} onClose={onOpenCloseEditConcep}>
        <CotizacionConceptosEditForm
          reload={reload}
          onReload={onReload}
          conceptToEdit={currentConcept}
          onOpenCloseEditConcep={onOpenCloseEditConcep}
          onOpenCloseConfirm={onOpenCloseConfirm}
        />
      </BasicModal>

      <Confirm
        open={showConfirm}
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
        onConfirm={handleDeleteConcept}
        onCancel={() => setShowConfirm(false)}
        onClick={() => onOpenCloseConfirm}
        content='¿ Estas seguro de eliminar el concepto ?'
      />

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
        onConfirm={handleDelete}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la cotización ?'
      />

    </>

  )
}
