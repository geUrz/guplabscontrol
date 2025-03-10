import { Confirm, IconClose } from '@/components/Layouts'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { formatCurrency, genRECId } from '@/helpers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { RowHeadModal } from '../RowHead'
import styles from './ReciboForm.module.css'
import { BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'

export function ReciboForm(props) {

  const { reload, onReload, onOpenCloseForm, onToastSuccess } = props

  const { user } = useAuth()

  const [showConfirm, setShowConfirm] = useState(false)

  const [toggle, setToggle] = useState(false)

  const onToggle = () => setToggle((prevState) => !prevState)

  const [cotizacion, setCotizacion] = useState('')
  const [cotizaciones, setCotizaciones] = useState([])
  const [recibo, setRecibo] = useState('')
  const [conceptos, setConceptos] = useState([])
  const [nuevoConcepto, setNuevoConcepto] = useState({
    tipo: '',
    concepto: '',
    precio: '',
    cantidad: ''
  })
  const [toggleIVA, setToggleIVA] = useState(false)

  const onShowConfirm = (index) => {
    setConceptoAEliminar(index)
    setShowConfirm(true)
  }

  const onHideConfirm = () => {
    setConceptoAEliminar(null)
    setShowConfirm(false)
  }

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!recibo) {
      newErrors.recibo = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const validarFormConceptos = () => {
    const newErrors = {}

    if (!nuevoConcepto.tipo) {
      newErrors.tipo = 'El campo es requerido'
    }

    if (!nuevoConcepto.concepto) {
      newErrors.concepto = 'El campo es requerido'
    }

    if (!nuevoConcepto.precio) {
      newErrors.precio = 'El campo es requerido'
    } else if (nuevoConcepto.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0'
    }

    if (!nuevoConcepto.cantidad) {
      newErrors.cantidad = 'El campo es requerido'
    } else if (nuevoConcepto.cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const crearRecibo = async (e) => {
    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genRECId(4)

    try {
      const response = await axios.post('/api/recibos/recibos', {
        usuario_id: user.id,
        folio,
        recibo,
        residencial_id: user.residencial_id
      })
      const reciboId = response.data.id
      await Promise.all(conceptos.map(concepto =>
        axios.post('/api/recibos/conceptos', { recibo_id: reciboId, ...concepto })
      ))
      setRecibo('')
      setConceptos([])
      
      onReload()
      onOpenCloseForm()
      onToastSuccess()
    } catch (error) {
      console.error('Error al crear el recibo:', error)

    }
  }

  const añadirConcepto = () => {
    if (!validarFormConceptos()) {
      return
    }
    setConceptos([...conceptos, nuevoConcepto])
    setNuevoConcepto({ tipo: '', concepto: '', precio: '', cantidad: '' })
  }

  const [conceptoAEliminar, setConceptoAEliminar] = useState(null)

  const eliminarConcepto = () => {
    const nuevosConceptos = conceptos.filter((_, i) => i !== conceptoAEliminar);
    setConceptos(nuevosConceptos);
    onHideConfirm();
  }

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        const response = await axios.get(`/api/cotizaciones/cotizaciones?residencial_id=${user.residencial_id}`);
        setCotizaciones(response.data);
      } catch (error) {
        console.error('Error al obtener las cotizaciones:', error);
      }
    };
    fetchCotizaciones();
  }, []);

  // Consultar los conceptos de la cotización seleccionada
  useEffect(() => {
    if (cotizacion) {
      const fetchConceptos = async () => {
        try {
          const response = await axios.get(`/api/cotizaciones/conceptos?cotizacion_id=${cotizacion}`);
          setConceptos(response.data);
          // Aquí puedes mapear los conceptos y rellenar los campos, si es necesario

          setNuevoConcepto({
            tipo: '',
            concepto: '',
            precio: '',
            cantidad: ''
          })

          const cotizacionResponse = await axios.get(`/api/cotizaciones/cotizaciones?id=${cotizacion}`);
          setRecibo(cotizacionResponse.data?.cotizacion || '')



        } catch (error) {
          console.error('Error al obtener los conceptos:', error);
        }
      };
      fetchConceptos();
    }
  }, [cotizacion])

  const calcularTotales = () => {
    const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    return { subtotal, iva, total }
  };

  const { subtotal, iva, total } = calcularTotales()

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA))
  }, [toggleIVA])

  const onIVA = () => {
    setToggleIVA(prevState => (!prevState))
  } 

  const opcionesSerprod = [
    { key: 1, text: 'Servicio', value: 'Servicio' },
    { key: 2, text: 'Producto', value: 'Producto' }
  ]

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>
        <Form>
          <FormGroup widths='equal'>
          <FormField>
              
              <div className={styles.toggleCot}>
              {toggle ?
                <div className={styles.toggleOn} onClick={onToggle}>
                  <Label>Cotización</Label>
                  <BiSolidToggleRight/>
                </div> : 
                <div className={styles.toggleOff} onClick={onToggle}>
                  <Label>Cotización</Label>
                  <BiSolidToggleLeft/>
                </div>
              }
              </div>

              {toggle ?
                <Dropdown
                placeholder='Selecciona un folio'
                fluid
                selection
                options={cotizaciones.map(cot => ({ key: cot.id, text: cot.folio, value: cot.id }))}
                value={cotizacion}
                onChange={(e, { value }) => setCotizacion(value)}
                /> : null
              }

            </FormField>
            <FormField error={!!errors.recibo}>
              <Label>Recibo</Label>
              <Input
                type="text"
                value={recibo}
                onChange={(e) => setRecibo(e.target.value)}
              />
              {errors.recibo && <Message negative>{errors.recibo}</Message>}
            </FormField>
          </FormGroup>
        </Form>

        <Form>
          <FormGroup widths='equal'>
            <FormField>
              <Label>Tipo</Label>
              <Dropdown
                placeholder='Selecciona una opción'
                fluid
                selection
                options={opcionesSerprod}
                value={nuevoConcepto.tipo}
                onChange={(e, { value }) => setNuevoConcepto({ ...nuevoConcepto, tipo: value })}
              />
            </FormField>
            <FormField>
              <Label>Concepto</Label>
              <Input
                type="text"
                value={nuevoConcepto.concepto}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, concepto: e.target.value })}
              />
            </FormField>
            <FormField>
              <Label>Precio</Label>
              <Input
                type="number"
                value={nuevoConcepto.precio}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, precio: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              />
            </FormField>
            <FormField>
              <Label>Qty</Label>
              <Input
                type="number"
                value={nuevoConcepto.cantidad}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, cantidad: e.target.value === '' ? '' : parseInt(e.target.value) })}
              />
            </FormField>
          </FormGroup>
          <Button secondary onClick={añadirConcepto}>Añadir Concepto</Button>
        </Form>

        <div className={styles.section}>

          <RowHeadModal rowMain />

          {conceptos.map((concepto, index) => (
            <div key={index} className={styles.rowMap} onClick={() => onShowConfirm(index)}>
              <h1>{concepto.tipo}</h1>
              <h1>{concepto.concepto}</h1>
              <h1>${formatCurrency(concepto.precio * 1)}</h1>
              <h1>{concepto.cantidad}</h1>
              <h1>${formatCurrency(concepto.precio * concepto.cantidad)}</h1>
            </div>
          ))}

          <div className={styles.box3}>
            <div className={styles.box3_1}>
              <h1>Subtotal:</h1>

              {!toggleIVA ? (

                <div className={styles.toggleOFF} onClick={onIVA}>
                  <BiSolidToggleLeft />
                  <h1>IVA:</h1>
                </div>

              ) : (

                <div className={styles.toggleON} onClick={onIVA}>
                  <BiSolidToggleRight />
                  <h1>IVA:</h1>
                </div>

              )}

              <h1>Total:</h1>
            </div>

            <div className={styles.box3_2}>

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

        </div>

        <Button primary onClick={crearRecibo}>Crear</Button>

      </div>

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
        onConfirm={eliminarConcepto}
        onCancel={onHideConfirm}
        content='¿Estás seguro de eliminar el concepto?'
      />

    </>

  )
}
