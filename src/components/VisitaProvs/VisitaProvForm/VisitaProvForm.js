import { Button, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { genVPId } from '@/helpers'
import styles from './VisitaProvForm.module.css'

export function VisitaProvForm(props) {

  const { user } = useAuth()

  const [visitaprovedor, setVisitaprov] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const { reload, onReload, onOpenCloseForm, onToastSuccess } = props

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!visitaprovedor) {
      newErrors.visitaprovedor = 'El campo es requerido'
    }

    if (!descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleVisitaprovChange = (e) => {
    const value = e.target.value
    setVisitaprov(value)
  }

  const crearVisitaprov = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genVPId(4)
    const estado = 'Sin ingresar'

    try {
      await axios.post('/api/visitaprovedores/visitaprovedores', {
        usuario_id: user.id,
        folio,
        visitaprovedor,
        descripcion, 
        estado,
        autorizo: user.id,
        residencial_id: user.residencial_id
      })

      setVisitaprov('')
      setDescripcion('')

      onReload()
      onOpenCloseForm()
      onToastSuccess()

    } catch (error) {
      console.error('Error al crear la visita provedor:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>

        <div className={styles.container}>

          <Form>
            <FormGroup widths='equal'>
              <FormField error={!!errors.visitaprovedor}>
                <Label>
                  Visita proveedor
                </Label>
                <Input
                  name='visitaprovedor'
                  type="text"
                  value={visitaprovedor}
                  onChange={handleVisitaprovChange}
                />
                {errors.visitaprovedor && <Message negative>{errors.visitaprovedor}</Message>}
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
            </FormGroup>
            <Button
              primary
              onClick={crearVisitaprov}
            >
              Crear
            </Button>

          </Form>

        </div>

      </div>

    </>

  )
}
