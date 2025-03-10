import { Button, Form, FormField, FormGroup, Input, Label, Message, TextArea, Dropdown } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { IconClose } from '@/components/Layouts'
import { genOSId } from '@/helpers'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaToggleOff, FaToggleOn } from 'react-icons/fa'
import styles from './OrdenServicioForm.module.css'

export function OrdenServicioForm(props) {
  const { user } = useAuth()
  const { reload, onReload, onOpenCloseForm, onToastSuccess } = props

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [date, setDate] = useState(null)
  const [visitatecnicas, setVisitatecnicas] = useState([])
  const [selectedVisita, setSelectedVisita] = useState(null)
  
  const [toggle, setToggle] = useState(false)
  const onToggle = () => setToggle((prevState) => !prevState)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchVisitasTecnicas = async () => {
      try {
        const response = await axios.get(`/api/visitatecnica/visitatecnica?residencial_id=${user.residencial_id}`)
        const visitas = response.data.map(visita => ({
          key: visita.id,
          text: `${visita.folio}`,
          value: visita.id
        }))
        setVisitatecnicas(visitas)
      } catch (error) {
        console.error('Error al cargar visitas técnicas:', error)
      }
    }

    fetchVisitasTecnicas()
  }, [])

  useEffect(() => {
    const fetchVisitaData = async () => {
      if (toggle && selectedVisita) {
        try {
          const response = await axios.get(`/api/visitatecnica/visitatecnica?id=${selectedVisita}`)
          const visitaData = response.data
          setNombre(visitaData.visitatecnica)
          setDescripcion(visitaData.descripcion)
        } catch (error) {
          console.error('Error al obtener datos de visita técnica:', error)
        }
      } else {
        setNombre('')
        setDescripcion('')
      }
    }

    fetchVisitaData()
  }, [toggle, selectedVisita])

  // Validación del formulario
  const validarForm = () => {
    const newErrors = {}

    if (!nombre) newErrors.nombre = 'El campo es requerido'
    if (!descripcion) newErrors.descripcion = 'El campo es requerido'
    if (!date) newErrors.date = 'El campo es requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const crearOrdenservicio = async (e) => {
    e.preventDefault()

    if (!validarForm()) return

    const folio = genOSId(4)
    const formattedDate = date ? date.toISOString().split('T')[0] : null

    try {

      const visitaFolioRef = visitatecnicas.find(visita => visita.key === selectedVisita)?.text || null


      await axios.post('/api/ordenservicio/ordenservicio', {
        usuario_id: user.id,
        folio,
        nombre,
        descripcion,
        date: formattedDate,
        residencial_id: user.residencial_id,
        visitatecnica_id: selectedVisita,
        folioref: visitaFolioRef
      })

      setNombre('')
      setDescripcion('')
      setDate(null)
      setSelectedVisita(null)

      onReload()
      onOpenCloseForm()
      onToastSuccess()
    } catch (error) {
      console.error('Error al crear la órden de servicio:', error)
    }
  }

  return (
    <>
      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>
        <div className={styles.container}>
          <Form>
            <FormGroup widths='equal'>
              <div className={styles.toogleMain}>
                <h1>Visita técnica</h1>
                {toggle ? <FaToggleOn onClick={onToggle} /> : <FaToggleOff onClick={onToggle} />}
              </div>

              {toggle ? (
                <FormField>
                  <Label>Seleccionar folio</Label>
                  <Dropdown
                    placeholder='Seleccionar folio'
                    fluid
                    selection
                    options={visitatecnicas}
                    value={selectedVisita}
                    onChange={(e, { value }) => setSelectedVisita(value)}
                  />
                  {errors.visita && <Message negative>{errors.visita}</Message>}
                </FormField>
              ) : null}

              <FormField error={!!errors.nombre}>
                <Label>Órden de servicio</Label>
                <Input
                  name='nombre'
                  type='text'
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                {errors.nombre && <Message negative>{errors.nombre}</Message>}
              </FormField>

              <FormField error={!!errors.descripcion}>
                <Label>Descripción</Label>
                <TextArea
                  name='descripcion'
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
                {errors.descripcion && <Message negative>{errors.descripcion}</Message>}
              </FormField>
              <FormField error={!!errors.date}>
                <Label>Fecha</Label>
                <DatePicker
                  selected={date}
                  onChange={setDate}
                  dateFormat='dd/MM/yyyy'
                  placeholderText='dd/mm/aaaa'
                  locale='es'
                  isClearable
                  showPopperArrow={false}
                  popperPlacement='top'
                />
                {errors.date && <Message negative>{errors.date}</Message>}
              </FormField>
            </FormGroup>

            <Button primary onClick={crearOrdenservicio}>
              Crear
            </Button>
          </Form>
        </div>
      </div>

    </>
  )
}
