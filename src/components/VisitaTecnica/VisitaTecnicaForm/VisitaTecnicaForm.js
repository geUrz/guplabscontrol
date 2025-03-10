import { Button, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { genVTId } from '@/helpers'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './VisitaTecnicaForm.module.css'

export function VisitaTecnicaForm(props) {

  const { user } = useAuth()

  const [visitatecnica, setVisitatecnica] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [date, setDate] = useState(null)

  const { reload, onReload, onOpenCloseForm, onToastSuccess } = props

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!visitatecnica) {
      newErrors.visitatecnica = 'El campo es requerido'
    }

    if (!descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!date) {
      newErrors.date = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleVisitatecnicaChange = (e) => {
    const value = e.target.value
    setVisitatecnica(value)
  }

  const crearVisitatecnica = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genVTId(4)
    const formattedDate = date ? date.toISOString().split('T')[0] : null
    const estado = 'Pendiente'

    try {
      await axios.post('/api/visitatecnica/visitatecnica', {
        usuario_id: user.id,
        folio,
        visitatecnica,
        descripcion,
        date: formattedDate,
        estado,
        residencial_id: user.residencial_id
      })

      setVisitatecnica('')
      setDescripcion('')
      setDate(null)

      onReload()
      onOpenCloseForm()
      onToastSuccess()

    } catch (error) {
      console.error('Error al crear la visitatecnica:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>

        <div className={styles.container}>

          <Form>
            <FormGroup widths='equal'>
              <FormField error={!!errors.visitatecnica}>
                <Label>
                  Visita técnica
                </Label>
                <Input
                  name='visitatecnica'
                  type="text"
                  value={visitatecnica}
                  onChange={handleVisitatecnicaChange}
                />
                {errors.visitatecnica && <Message negative>{errors.visitatecnica}</Message>}
              </FormField>
              <FormField error={!!errors.descripcion}>
                <Label>
                  Descripción
                </Label>
                <TextArea
                  name='descripcion'
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
                {errors.descripcion && <Message negative>{errors.descripcion}</Message>}
              </FormField>
              <FormField error={!!errors.date}>
                <Label>
                  Fecha
                </Label>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/aaaa"
                  locale="es"
                  isClearable
                  showPopperArrow={false}
                  popperPlacement="top"
                />
                {errors.date && <Message negative>{errors.date}</Message>}
              </FormField>
            </FormGroup>
            <Button
              primary
              onClick={crearVisitatecnica}
            >
              Crear
            </Button>

          </Form>

        </div>

      </div>

    </>

  )
}
