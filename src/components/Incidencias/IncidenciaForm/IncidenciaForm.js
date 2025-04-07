import { Button, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import styles from './IncidenciaForm.module.css'
import { genIncId } from '@/helpers'

export function IncidenciaForm(props) {

  const { user, reload, onReload, onOpenCloseForm, onToastSuccess } = props

  
  const [incidencia, setIncidencia] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [zona, setZona] = useState('')

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!incidencia) {
      newErrors.incidencia = 'El campo es requerido'
    }

    if (!descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!zona) {
      newErrors.zona = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleIncidenciaChange = (e) => {
    const value = e.target.value
    setIncidencia(value)
  }

  const crearIncidencia = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genIncId(4)
    const estado = 'Pendiente'

    try {
      await axios.post('/api/incidencias/incidencias', {
        usuario_id: user.id,
        folio,
        incidencia,
        descripcion,
        zona,
        estado, 
        residencial_id: user.residencial_id
      })

      await axios.post('/api/notificaciones', 
        {
          title: '¡Incidencia creada!',
          body: `${incidencia}`,
          url: '/incidencias' 
        },
        {
          headers: {
            'Content-Type': 'application/json', 
          },
        }
      )

      setIncidencia('')
      setDescripcion('')
      setZona('')

      onReload()
      onOpenCloseForm()
      onToastSuccess()

    } catch (error) {
      console.error('Error al crear el incidencia:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>

        <div className={styles.container}>

          <Form>
            <FormGroup widths='equal'>
              <FormField error={!!errors.incidencia}>
                <Label>
                  Incidencia
                </Label>
                <Input
                  name='incidencia'
                  type="text"
                  value={incidencia}
                  onChange={handleIncidenciaChange}
                />
                {errors.incidencia && <Message negative>{errors.incidencia}</Message>}
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
              <FormField error={!!errors.zona}>
                <Label>
                  Zona
                </Label>
                <TextArea
                  name='zona'
                  type="text"
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                />
                {errors.zona && <Message negative>{errors.zona}</Message>}
              </FormField>
            </FormGroup>
            <Button
              primary
              onClick={crearIncidencia}
            >
              Crear
            </Button>

          </Form>

          <div className={styles.mensajeImg}>
            <h1>* Podrás subir imagenes despues de crear la incidencia</h1>
          </div>
        
        </div>

      </div>

    </>

  )
}
