import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { Form, Button, Input, Label, FormGroup, FormField, Message, Dropdown } from 'semantic-ui-react'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import styles from './ResidenteEditForm.module.css'
import { BasicModal } from '@/layouts'
import { ProtectedMessage } from '@/components/Layouts'

export function ResidenteEditForm(props) {
  const { reload, onReload, residenteData, actualizarResidente, onOpenClose, onToastSuccessMod } = props

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showError, setShowError] = useState(false)

  const onCloseError = () => {
    setShowError(false)
    onOpenCloseForm()
  }

  const [formData, setFormData] = useState({
    newNombre: residenteData.nombre || '',
    newUsuario: residenteData.usuario || '',
    newPrivada: residenteData.privada || '',
    newCalle: residenteData.calle || '',
    newCasa: residenteData.casa || '',
    newEmail: residenteData.email || '',
    newIsAdmin: residenteData.isadmin || '',
    newIsActive: residenteData.isactive ? 1 : 0,
    newResidencial: residenteData.residencial_id || ''
  });

  const [residenciales, setResidenciales] = useState([])
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const validarFormUser = () => {
    const newErrors = {}
    if (!formData.newNombre) newErrors.newNombre = 'El campo es requerido'
    if (!formData.newUsuario) newErrors.newUsuario = 'El campo es requerido'
    if (!formData.newResidencial) {
      newErrors.newResidencial = 'El campo es requerido'
    }
    if (!formData.newIsAdmin) {
      newErrors.newIsAdmin = 'El campo es requerido'
    }
    if (formData.newIsActive === undefined || formData.newIsActive === '') {
      newErrors.newIsActive = 'El campo es requerido';
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    setErrorMessage("")

    if (!validarFormUser()) {
      return
    }

    setError(null)

    try {
      await axios.put(`/api/usuarios/usuarios?id=${residenteData.id}`, {
        nombre: formData.newNombre,
        usuario: formData.newUsuario,
        privada: formData.newPrivada,
        calle: formData.newCalle,
        casa: formData.newCasa,
        email: formData.newEmail,
        isadmin: formData.newIsAdmin,
        isactive: formData.newIsActive,
        residencial_id: formData.newResidencial
      })

      onReload()

      const response = await axios.get(`/api/usuarios/usuarios?id=${residenteData.id}`);
      actualizarResidente(response.data)

      onOpenClose()
      onToastSuccessMod()

    } catch (error) {
      setIsLoading(false)

      if (error.response) {
        setErrorMessage(error.response.data.error || "Hubo un problema al crear la visita.")
      } else {
        setErrorMessage("No se pudo conectar al servidor.")
      }

      setShowError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchResidenciales = async () => {
      try {
        const response = await axios.get('/api/residenciales/residenciales')
        const opcionesResidenciales = response.data.map(res => ({
          key: res.id,
          text: res.nombre,
          value: res.id
        }))
        setResidenciales(opcionesResidenciales)
      } catch (error) {
        console.error('Error al cargar residenciales:', error)
      }
    }

    fetchResidenciales()
  }, [])

  const opcionesNivel = [
    { key: 1, text: 'Admin', value: 'Admin' },
    { key: 2, text: 'ComitéSU', value: 'ComitéSU' },
    { key: 3, text: 'Comité', value: 'Comité' },
    { key: 4, text: 'Residente', value: 'Residente' },
    { key: 5, text: 'Caseta', value: 'Caseta' },
    { key: 6, text: 'Técnico', value: 'Técnico' }
  ]

  const opcionesIsActive = [
    { key: 1, text: 'Activo', value: 1 },
    { key: 2, text: 'Inactivo', value: 0 }
  ]

  const permissions = useMemo(() => {

    if (!formData) return {}

    return {

      showDatosResidente: ['ComitéSU', 'Comité', 'Caseta', 'Residente'].includes(formData.newIsAdmin)

    }

  }, [formData])

  return (
    <>
      <IconClose onOpenClose={onOpenClose} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.newNombre}>
            <Label>Nombre</Label>
            <Input
              name='newNombre'
              type='text'
              value={formData.newNombre}
              onChange={handleChange}
            />
            {errors.newNombre && <Message negative>{errors.newNombre}</Message>}
          </FormField>
          <FormField error={!!errors.newUsuario}>
            <Label>Usuario</Label>
            <Input
              name='newUsuario'
              type='text'
              value={formData.newUsuario}
              onChange={handleChange}
            />
            {errors.newUsuario && <Message negative>{errors.newUsuario}</Message>}
          </FormField>
          <FormField error={!!errors.newResidencial}>
            <Label>Residencial</Label>
            <Dropdown
              placeholder='Selecciona residencial'
              fluid
              selection
              options={residenciales}
              name='newResidencial'
              value={formData.newResidencial}
              onChange={(e, { value }) => setFormData({ ...formData, newResidencial: value })}
            />
            {errors.newResidencial && <Message negative>{errors.newResidencial}</Message>}
          </FormField>
          <FormField error={!!errors.newIsAdmin}>
            <Label>Nivel</Label>
            <Dropdown
              placeholder='Selecciona una opción'
              fluid
              selection
              options={opcionesNivel}
              value={formData.newIsAdmin}
              onChange={(e, { value }) => setFormData({ ...formData, newIsAdmin: value })}
            />
            {errors.newIsAdmin && <Message negative>{errors.newIsAdmin}</Message>}
          </FormField>

          {permissions.showDatosResidente &&

            <>

              <FormField>
                <Label>Privada</Label>
                <Input
                  name='newPrivada'
                  type="text"
                  value={formData.newPrivada}
                  onChange={handleChange}
                />
              </FormField>
              <FormField>
                <Label>Calle</Label>
                <Input
                  name='newCalle'
                  type="text"
                  value={formData.newCalle}
                  onChange={handleChange}
                />
              </FormField>
              <FormField>
                <Label>Casa</Label>
                <Input
                  name='newCasa'
                  type='number'
                  value={formData.newCasa}
                  onChange={handleChange}
                />
              </FormField>

            </>

          }

          <FormField>
            <Label>Correo</Label>
            <Input
              name='newEmail'
              type='email'
              value={formData.newEmail}
              onChange={handleChange}
            />
          </FormField>
          <FormField error={!!errors.newIsActive}>
            <Label>Estado</Label>
            <Dropdown
              placeholder='Selecciona una opción'
              fluid
              selection
              options={opcionesIsActive}
              value={formData.newIsActive}
              onChange={(e, { value }) => setFormData({ ...formData, newIsActive: Number(value) })}
            />
            {errors.newIsActive && <Message negative>{errors.newIsActive}</Message>}
          </FormField>
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}
        <Button primary onClick={handleSubmit}>Guardar</Button>
      </Form>

      <BasicModal show={showError} onClose={onCloseError} >
        <ProtectedMessage errorMessage={errorMessage} onCloseError={onCloseError} />
      </BasicModal>

    </>
  )
}
