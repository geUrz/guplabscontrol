import { Button, Checkbox, Dropdown, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react';
import { useState } from 'react';
import axios from 'axios';
import { IconClose } from '@/components/Layouts/IconClose/IconClose';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './VisitaForm.module.css';
import { BasicModal } from '@/layouts';
import { ProtectedMessage } from '@/components/Layouts';

export function VisitaForm(props) {
  const [visita, setVisita] = useState('')
  const [tipovisita, setTipovisita] = useState('')
  const [tipoacceso, setTipoacceso] = useState('')
  const [date, setDate] = useState(null)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [hora, setHora] = useState('')
  const [diasSeleccionados, setDiasSeleccionados] = useState([])
  
  const { user, reload, onReload, onOpenCloseForm, onToastSuccess } = props;
  const [errors, setErrors] = useState({})
  
  const diasOrdenados = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const validarForm = () => {
    const newErrors = {};

    if (!visita) newErrors.visita = 'El campo es requerido';
    if (!tipovisita) newErrors.tipovisita = 'El campo es requerido';

    if (tipoacceso === 'frecuente' && diasSeleccionados.length === 0) {
      newErrors.dias = 'Debe seleccionar al menos un día';
    }

    if (!tipoacceso) newErrors.tipoacceso = 'El campo es requerido';

    if (tipoacceso === 'frecuente') {
      if (!fromDate) newErrors.fromDate = 'El campo es requerido';
      if (!toDate) newErrors.toDate = 'El campo es requerido';
      if (fromDate && toDate && fromDate > toDate) {
        newErrors.dateRange = 'La fecha de "Desde" debe ser anterior a "Hasta"';
      }
    } else if (tipoacceso === 'eventual') {
      if (!date) newErrors.date = 'El campo es requerido';
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;
  };

  const handleVisitaChange = (e) => {
    setVisita(e.target.value)
  };

  const handleDiaChange = (dia) => {
    setDiasSeleccionados((prev) => 
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    )
  };

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showError, setShowError] = useState(false)
  const onCloseError = () => {
    setShowError(false)
    onOpenCloseForm()
  }

  const crearVisita = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    setErrorMessage("")

    if (!validarForm()) return;

    const formattedDate = date ? date.toISOString().split('T')[0] : null;
    const formattedFromDate = fromDate ? fromDate.toISOString().split('T')[0] : null;
    const formattedToDate = toDate ? toDate.toISOString().split('T')[0] : null;

    const diasOrdenadosSeleccionados = diasSeleccionados.sort((a, b) => 
      diasOrdenados.indexOf(a) - diasOrdenados.indexOf(b)
    )

    try {

      await axios.post('/api/visitas/visitas', {
        usuario_id: user.id,
        visita,
        tipovisita,
        tipoacceso,
        date: formattedDate,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        hora,
        estado: 'Sin ingresar', 
        dias: tipoacceso === 'frecuente' ? diasOrdenadosSeleccionados.join(', ') : null,
        residencial_id: user.residencial_id
      }, {
        withCredentials: true,
      })

      setVisita('')
      setTipovisita('')
      setTipoacceso('')
      setDate(null)
      setFromDate(null)
      setToDate(null)
      setHora('')
      setDiasSeleccionados([])

      onReload()
      onOpenCloseForm()
      onToastSuccess()
      setIsLoading(false)
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
  };

  const opcionesTipovisita = [
    { key: 1, text: 'Familia', value: 'Familia' },
    { key: 2, text: 'Amigo', value: 'Amigo' },
    { key: 3, text: 'Proveedor', value: 'Proveedor' },
    { key: 4, text: 'Diddi, Uber, Rappi', value: 'Diddi, Uber, Rappi' }
  ];

  const opcionesTipoacceso = [
    { key: 1, text: 'Eventual', value: 'eventual' },
    { key: 2, text: 'Frecuente', value: 'frecuente' }
  ]

  return (
    <>
      <IconClose onOpenClose={onOpenCloseForm} />
      <div className={styles.main}>
        <div className={styles.container}>
          <Form>
            <FormGroup widths='equal'>
              <FormField error={!!errors.visita}>
                <Label>Nombre de la visita</Label>
                <Input
                  name='visita'
                  type="text"
                  value={visita}
                  onChange={handleVisitaChange}
                />
                {errors.visita && <span className={styles.error}>{errors.visita}</span>}
              </FormField>
              <FormField error={!!errors.tipovisita}>
                <Label>Tipo de visita</Label>
                <Dropdown
                  placeholder='Seleccionar una opción'
                  fluid
                  selection
                  options={opcionesTipovisita}
                  value={tipovisita}
                  onChange={(e, { value }) => setTipovisita(value)}
                />
                {errors.tipovisita && <span className={styles.error}>{errors.tipovisita}</span>}
              </FormField>
              <FormField error={!!errors.tipoacceso}>
                <Label>Tipo de acceso</Label>
                <Dropdown
                  placeholder='Seleccionar una opción'
                  fluid
                  selection
                  options={opcionesTipoacceso}
                  value={tipoacceso}
                  onChange={(e, { value }) => setTipoacceso(value)}
                />
                {errors.tipoacceso && <span className={styles.error}>{errors.tipoacceso}</span>}
              </FormField>
            </FormGroup>

            {tipoacceso === 'frecuente' && (
              <div className={styles.diasSemana}>
                <Label>Días de la semana</Label>
                {diasOrdenados.map((dia) => (
                  <div key={dia}>
                    <Label className={styles.formLabel} htmlFor={dia}>{dia}</Label>
                    <Checkbox
                      id={dia}
                      checked={diasSeleccionados.includes(dia)}
                      onChange={() => handleDiaChange(dia)}
                    />
                  </div>
                ))}
                {errors.dias && <span className={styles.error}>{errors.dias}</span>}
              </div>
            )}

            {tipoacceso === 'frecuente' ? (
              <>
                <FormField error={!!errors.fromDate}>
                  <Label>Fecha de acceso</Label>
                  <Label>Desde</Label>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
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
                  <Label>Hasta</Label>
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/aaaa"
                    locale="es"
                    isClearable
                    showPopperArrow={false}
                    popperPlacement="top"
                  />
                  {errors.toDate && <span className={styles.error}>{errors.toDate}</span>}
                  {errors.dateRange && <span className={styles.error}>{errors.dateRange}</span>}
                </FormField>
              </>
            ) : (
              <FormField error={!!errors.date}>
                <Label>Fecha</Label>
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
                {errors.date && <span className={styles.error}>{errors.date}</span>}
              </FormField>
            )}

            <Button primary loading={isLoading} onClick={crearVisita}>
              Crear
            </Button>
          </Form>
        </div>
      </div>

      <BasicModal show={showError} onClose={onCloseError} >
        <ProtectedMessage errorMessage={errorMessage} onCloseError={onCloseError}  />
      </BasicModal>

    </>
  )
}
