import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Checkbox, Dropdown, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import styles from './VisitaEditForm.module.css'

registerLocale('es', es)

export function VisitaEditForm(props) {

  const { reload, onReload, visitaData, actualizarVisita, onOpenEditVisita, onToastSuccessMod } = props

  const diasOrdenados = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

  const [formData, setFormData] = useState({
    visita: visitaData.visita,
    cel: visitaData.cel,
    tipovisita: visitaData.tipovisita,
    tipoacceso: visitaData.tipoacceso,
    date: visitaData.date ? new Date(visitaData.date + 'T00:00:00') : null,
    fromDate: visitaData.fromDate ? new Date(visitaData.fromDate + 'T00:00:00') : null,
    toDate: visitaData.toDate ? new Date(visitaData.toDate + 'T00:00:00') : null,
    hora: visitaData.hora,
    estado: visitaData.estado,
    diasSeleccionados: visitaData.dias ? visitaData.dias.split(',').map(dia => dia.trim()) : []
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.visita) {
      newErrors.visita = 'El campo es requerido'
    }

    if (!formData.tipovisita) {
      newErrors.tipovisita = 'El campo es requerido'
    }

    if (formData.tipoacceso === 'frecuente' && formData.diasSeleccionados.length === 0) {
      newErrors.dias = 'Debe seleccionar al menos un día'
    }

    if (!formData.tipoacceso) {
      newErrors.tipoacceso = 'El campo es requerido'
    }

    if (formData.tipoacceso === 'frecuente') {
      if (!formData.fromDate) {
        newErrors.fromDate = 'El campo es requerido'
      }

      if (!formData.toDate) {
        newErrors.toDate = 'El campo es requerido'
      }
    } else if (formData.tipoacceso === 'eventual') {
      if (!formData.date) {
        newErrors.date = 'El campo es requerido'
      }
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDiaChange = (dia) => {
    setFormData((prev) => {
      const diasSeleccionados = prev.diasSeleccionados.includes(dia)
        ? prev.diasSeleccionados.filter(d => d !== dia)
        : [...prev.diasSeleccionados, dia];

      // Ordenar los días seleccionados
      return { ...prev, diasSeleccionados: diasSeleccionados.sort((a, b) => diasOrdenados.indexOf(a) - diasOrdenados.indexOf(b)) };
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validarForm()) {
      return;
    }
  
    // Formatear las fechas
    const formatDate = (date) => date ? date.toISOString().split('T')[0] : null;
  
    const formattedData = {
      ...formData,
      date: formatDate(formData.date),
      fromDate: formatDate(formData.fromDate),
      toDate: formatDate(formData.toDate),
      dias: formData.tipoacceso === 'frecuente' ? formData.diasSeleccionados.join(', ') : null
    };
  
    try {
      await axios.put(`/api/visitas/visitas?id=${visitaData.id}`, formattedData);
  
      onReload();
      actualizarVisita(formattedData);
      onOpenEditVisita();
      onToastSuccessMod();
    } catch (error) {
      console.error('Error actualizando la visita:', error);
    }
  }

  const opcionesTipovisita = [
    { key: 1, text: 'Familia', value: 'Familia' },
    { key: 2, text: 'Amigo', value: 'Amigo' },
    { key: 3, text: 'Proveedor', value: 'Proveedor' },
    { key: 4, text: 'Diddi, Uber, Rappi', value: 'Diddi, Uber, Rappi' }
  ]

  const opcionesTipoacceso = [
    { key: 1, text: 'Eventual', value: 'eventual' },
    { key: 2, text: 'Frecuente', value: 'frecuente' }
  ]

  const opcionesEstado = [
    { key: 1, text: 'Sin ingresar', value: 'Sin ingresar' },
    { key: 2, text: 'Ingresado', value: 'Ingresado' }
  ]

  const [activate, setActivate] = useState(false)

  const timer = useRef(null)

  const handleTouchStart = () => {
    timer.current = setTimeout(() => {
      setActivate(prev => !prev)
    }, 3000)
  }

  const handleTouchEnd = () => {
    clearTimeout(timer.current)
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === '0') {
      e.preventDefault()
      setActivate((prevState) => !prevState)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (

    <>

      <IconClose onOpenClose={onOpenEditVisita} />

      <Form onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <FormGroup widths='equal'>
          <FormField error={!!errors.visita}>
            <Label>
              Nombre de la visita
            </Label>
            <Input
              name='visita'
              type="text"
              value={formData.visita}
              onChange={handleChange}
            />
            {errors.visita && <span className={styles.error}>{errors.visita}</span>}
          </FormField>
          <FormField error={!!errors.tipovisita}>
            <Label>
              Tipo de visita
            </Label>
            <Dropdown
              placeholder='Seleccionar una opción'
              fluid
              selection
              options={opcionesTipovisita}
              value={formData.tipovisita}
              onChange={(e, { value }) => setFormData({ ...formData, tipovisita: value })}
            />
            {errors.tipovisita && <span className={styles.error}>{errors.tipovisita}</span>}
          </FormField>
          <FormField error={!!errors.tipoacceso}>
            <Label>
              Tipo de acceso
            </Label>
            <Dropdown
              placeholder='Seleccionar una opción'
              fluid
              selection
              options={opcionesTipoacceso}
              value={formData.tipoacceso}
              onChange={(e, { value }) => setFormData({ ...formData, tipoacceso: value })}
            />
            {errors.tipoacceso && <span className={styles.error}>{errors.tipoacceso}</span>}
          </FormField>

          {formData.tipoacceso === 'frecuente' && (
            <div className={styles.diasSemana}>
              <Label>Días de la semana</Label>
              {diasOrdenados.map((dia) => (
                <div key={dia}>
                  <Label className={styles.formLabel} htmlFor={dia}>{dia}</Label>
                  <Checkbox
                    id={dia}
                    checked={formData.diasSeleccionados.includes(dia)}
                    onChange={() => handleDiaChange(dia)}
                  />
                </div>
              ))}
              {errors.dias && <span className={styles.error}>{errors.dias}</span>}
            </div>
          )}

          {formData.tipoacceso === 'frecuente' ? (
            <>
              <FormField error={!!errors.fromDate}>
                <Label>Fecha de acceso</Label>
                <Label>
                  Desde
                </Label>
                <DatePicker
                  selected={formData.fromDate}
                  onChange={(fromDate) => setFormData({ ...formData, fromDate })}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/aaaa"
                  locale="es"
                  isClearable
                  showPopperArrow={false}
                  popperPlacement="top"
                />
                {errors.fromDate && <span className={styles.error}>{errors.fromDate}</span>}
              </FormField>
              <FormField error={!!errors.toDate}>
                <Label>
                  Hasta
                </Label>
                <DatePicker
                  selected={formData.toDate}
                  onChange={(toDate) => setFormData({ ...formData, toDate })}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/aaaa"
                  locale="es"
                  isClearable
                  showPopperArrow={false}
                  popperPlacement="top"
                />
                {errors.toDate && <span className={styles.error}>{errors.toDate}</span>}
              </FormField>
            </>
          ) : (
            <FormField error={!!errors.date}>
              <Label>
                Fecha
              </Label>
              <DatePicker
                selected={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/aaaa"
                locale="es"
                isClearable
                showPopperArrow={false}
                popperPlacement="top"
              />
              {errors.date && <span className={styles.error}>{errors.date}</span>}
            </FormField>
          )}

          <FormField error={!!errors.estado}>
            <Label>
              Estatus
            </Label>
            <Dropdown
              placeholder='Seleccionar una opción'
              fluid
              selection
              options={opcionesEstado}
              value={formData.estado}
              onChange={(e, { value }) => setFormData({ ...formData, estado: value })}
            />
            {errors.estado && <span className={styles.error}>{errors.estado}</span>}
          </FormField>

        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
