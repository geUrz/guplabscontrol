import { Button, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { genAnuId } from '@/helpers'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './AnuncioForm.module.css'

export function AnuncioForm(props) {

  const { user } = useAuth()

  const [anuncio, setAnuncio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [date, setDate] = useState(null)
  const [hora, setHora] = useState('')

  const { reload, onReload, onOpenCloseForm, onToastSuccess } = props

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!anuncio) {
      newErrors.anuncio = 'El campo es requerido'
    }

    if (!descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!date) {
      newErrors.date = 'El campo es requerido'
    }

    if (!hora) {
      newErrors.hora = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleAnuncioChange = (e) => {
    const value = e.target.value
    setAnuncio(value)
  }

  const crearAnuncio = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genAnuId(4)
    const formattedDate = date ? date.toISOString().split('T')[0] : null

    try {
      await axios.post('/api/anuncios/anuncios', {
        usuario_id: user.id,
        folio,
        anuncio,
        descripcion,
        date: formattedDate,
        hora,
        residencial_id: user.residencial_id
      })

      setAnuncio('')
      setDescripcion('')
      setDate(null)
      setHora('')

      onReload()
      onOpenCloseForm()
      onToastSuccess()

    } catch (error) {
      console.error('Error al crear el anuncio:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>

        <div className={styles.container}>

          <Form>
            <FormGroup widths='equal'>
              <FormField error={!!errors.anuncio}>
                <Label>
                  Anuncio
                </Label>
                <Input
                  name='anuncio'
                  type="text"
                  value={anuncio}
                  onChange={handleAnuncioChange}
                />
                {errors.anuncio && <Message negative>{errors.anuncio}</Message>}
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
              <FormField error={!!errors.hora}>
                <Label>
                  Hora
                </Label>
                <Input
                  name='hora'
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                />
                {errors.hora && <Message negative>{errors.hora}</Message>}
              </FormField>
            </FormGroup>
            <Button
              primary
              onClick={crearAnuncio}
            >
              Crear
            </Button>

          </Form>

        </div>

      </div>

    </>

  )
}
