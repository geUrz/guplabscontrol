import { Button, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { genRepId, genResId } from '@/helpers'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './ResidencialForm.module.css'

export function ResidencialForm(props) {

  const { user } = useAuth()

  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')

  const { reload, onReload, onOpenCloseForm, onToastSuccess } = props

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!nombre) {
      newErrors.nombre = 'El campo es requerido'
    }

    if (!direccion) {
      newErrors.direccion = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleReporteChange = (e) => {
    const value = e.target.value
    setNombre(value)
  }

  const crearResidencial = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genResId(4)

    try {
      await axios.post('/api/residenciales/residenciales', {
        usuario_id: user.id,
        folio,
        nombre,
        direccion
      })

      setNombre('')
      setDireccion('')

      onReload()
      onOpenCloseForm()
      onToastSuccess()

    } catch (error) {
      console.error('Error al crear el residencial:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>

        <div className={styles.container}>

          <Form>
            <FormGroup widths='equal'>
              <FormField error={!!errors.nombre}>
                <Label>
                  Residencial
                </Label>
                <Input
                  name='nombre'
                  type="text"
                  value={nombre}
                  onChange={handleReporteChange}
                />
                {errors.nombre && <Message negative>{errors.nombre}</Message>}
              </FormField>
              <FormField error={!!errors.direccion}>
                <Label>
                  Dirección
                </Label>
                <TextArea
                  name='direccion'
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
                {errors.direccion && <Message negative>{errors.direccion}</Message>}
              </FormField>
            </FormGroup>
            <Button
              primary
              onClick={crearResidencial}
            >
              Crear
            </Button>

          </Form>

        </div>

      </div>

    </>

  )
}
