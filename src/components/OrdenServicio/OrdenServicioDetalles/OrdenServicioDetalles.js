import { IconClose, Confirm, FirmaDigital } from '@/components/Layouts'
import { formatDate } from '@/helpers'
import { BasicModal, ModalImg } from '@/layouts'
import { FaCheck, FaEdit, FaImage, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Image, Label, Tab, TextArea } from 'semantic-ui-react'
import { useAuth } from '@/contexts/AuthContext'
import { OrdenServicioEditForm } from '../OrdenServicioEditForm'
import { OrdenServicioPDF } from '../OrdenServicioPDF'
import { BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'
import styles from './OrdenServicioDetalles.module.css'

export function OrdenServicioDetalles(props) {
  const { reload, onReload, ordenservicio, onCloseDetalles, onToastSuccessMod, onToastSuccessDel } = props

  const { user } = useAuth()

  const [showEditOrdenservicio, setShowEditOrdenservicio] = useState(false)
  const [showConfirmDel, setShowConfirmDel] = useState(false)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)
  const onOpenEditOrdenservicio = () => setShowEditOrdenservicio((prevState) => !prevState)

  const [showImg, setShowImg] = useState(false)
  const [selectedImg, setSelectedImg] = useState(null)
  const [showFirmaTecModal, setShowFirmaTecModal] = useState(false)
  const [showFirmaCliModal, setShowFirmaCliModal] = useState(false)
  const [firmaTec, setFirmaTec] = useState(ordenservicio.firmaTec || null)
  const [firmaCli, setFirmaCli] = useState(ordenservicio.firmaCli || null)
  const [showConfirmFirmaTec, setShowConfirmFirmaTec] = useState(false)
  const [showConfirmFirmaCli, setShowConfirmFirmaCli] = useState(false)

  const [toggleEviOS, setToggleEviOS] = useState(() => {
    const savedState = localStorage.getItem('toggleEviOS');
    return savedState !== null ? JSON.parse(savedState) : false;
  })

  const onToggleEviOS = () => {
    setToggleEviOS((prevState) => {
      const newState = !prevState;

      localStorage.setItem('toggleEviOS', JSON.stringify(newState));
      return newState;
    })
  }

  const openImg = (imgUrl) => {
    setSelectedImg(imgUrl)
    setShowImg(true)
  }

  const onOpenCloseFirmaTec = () => {
    setShowFirmaTecModal((prev) => !prev);
    if (!showFirmaTecModal) {
      fetchFirmaTec();  // Actualizar la firma del técnico
    }
  }

  const onOpenCloseFirmaCli = () => {
    setShowFirmaCliModal((prev) => !prev);
    if (!showFirmaCliModal) {
      fetchFirmaCli();  // Actualizar la firma del cliente
    }
  }

  const onOpenCloseConfirmFirmaTec = () => setShowConfirmFirmaTec((prev) => !prev)
  const onOpenCloseConfirmFirmaCli = () => setShowConfirmFirmaCli((prev) => !prev)

  useEffect(() => {
    fetchFirmaTec()
    fetchFirmaCli()
  }, [])

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent || ''
    const mobile = /Mobile|Android|iP(hone|od|ad)|IEMobile|Opera Mini/i.test(userAgent)
    setIsMobile(mobile)
  }, [])

  const SWIPE_THRESHOLD = 150

  const [startCoords, setStartCoords] = useState(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [activate, setActivate] = useState(false)

  // Maneja el inicio del deslizamiento
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setStartCoords({ x: touch.clientX, y: touch.clientY })
    setIsSwiping(true)
  }

  // Maneja el movimiento del deslizamiento
  const handleTouchMove = (e) => {
    if (!isSwiping) return

    const touch = e.touches[0]
    const endCoords = { x: touch.clientX, y: touch.clientY }

    // Calcula la distancia del deslizamiento
    const deltaX = endCoords.x - startCoords.x
    const deltaY = endCoords.y - startCoords.y
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

    // Si el deslizamiento supera el umbral, activa la acción
    if (distance > SWIPE_THRESHOLD) {
      setActivate(true)
    }
  }

  const handleTouchClick = () => {
    setActivate(false)
  }

  const handleDeleteOrdenservicio = async () => {
    if (ordenservicio?.id) {
      try {
        await axios.delete(`/api/ordenservicio/ordenservicio?id=${ordenservicio.id}`)
        onReload()
        onToastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la orden de servicio:', error)
      }
    } else {
      console.error('Orden de servicio o ID no disponible')
    }
  }

  const [visitatecnica, setVisitatecnica] = useState(null)

  useEffect(() => {
    const fetchVisitaTecnica = async () => {
      if (!ordenservicio?.visitatecnica_id) return

      try {
        const res = await axios.get(`/api/visitatecnica/visitatecnica?id=${ordenservicio.visitatecnica_id}`)
        setVisitatecnica(res.data)
      } catch (error) {
        console.error('Error al obtener la orden de servicio:', error)
      }
    }

    fetchVisitaTecnica()
  }, [ordenservicio.visitatecnica_id])

  const [images, setImages] = useState(null)

  useEffect(() => {
    (async () => {
      if (!ordenservicio?.visitatecnica_id) return;

      try {
        const res = await axios.get(`/api/visitatecnica/getImage?id=${ordenservicio.visitatecnica_id}`);
        setImages(res.data);
      } catch (error) {
        console.error('Error al obtener las imágenes:', error);
      }
    })();
  }, [ordenservicio.visitatecnica_id]);


  const [nota, setNota] = useState(ordenservicio.nota || '')
  const [editNota, setEditNota] = useState(!!ordenservicio.nota)
  const maxCharacters = 390

  const handleNotaChange = (e) => {
    const { value } = e.target
    if (value.length <= maxCharacters) {
      setNota(value)
    }
  }

  const handleAddNota = async () => {
    if (!ordenservicio.id) {
      console.error("ID de la orden de servicio no disponible")
      return
    }

    try {
      const response = await axios.put(`/api/ordenservicio/createNota`, {
        id: ordenservicio.id,
        notaValue: nota
      })

      if (response.status === 200) {
        setEditNota(true)
        onReload()
      }
    } catch (error) {
      console.error('Error al actualizar la nota:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    if (ordenservicio.nota) setEditNota(true)
  }, [ordenservicio])

  const fetchFirmaTec = async () => {
    try {
      const response = await axios.get(`/api/ordenservicio/ordenservicio?id=${ordenservicio.id}`);
      if (response.data.firmaTec) {
        setFirmaTec(response.data.firmaTec);  // Actualiza el estado con la firma
      }
    } catch (error) {
      console.error('Error al obtener la firma del técnico:', error);
    }
  }

  const fetchFirmaCli = async () => {
    try {
      const response = await axios.get(`/api/ordenservicio/ordenservicio?id=${ordenservicio.id}`);
      if (response.data.firmaCli) {
        setFirmaCli(response.data.firmaCli);  // Actualiza el estado con la firma
      }
    } catch (error) {
      console.error('Error al obtener la firma del cliente:', error);
    }
  }

  const removeFirmaTec = async () => {
    try {
      await axios.put(`/api/ordenservicio/createFirmaTec`, {
        id: ordenservicio.id,
        firmaValue: null
      })
      setFirmaTec(null)
      onOpenCloseConfirmFirmaTec()
    } catch (error) {
      console.error('Error al eliminar la firma del técnico:', error)
    }
  }

  const removeFirmaCli = async () => {
    try {
      await axios.put(`/api/ordenservicio/createFirmaCli`, {
        id: ordenservicio.id,
        firmaValue: null
      })
      setFirmaCli(null)
      onOpenCloseConfirmFirmaCli()
    } catch (error) {
      console.error('Error al eliminar la firma del cliente:', error)
    }
  }

  const imageKeys1 = ['img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7', 'img8', 'img9', 'img10']
  const imageKeys2 = ['img11', 'img12', 'img13', 'img14', 'img15', 'img16', 'img17', 'img18', 'img19', 'img20']

  const panes = [
    {
      menuItem: 'Antes',
      render: () => (
        <Tab.Pane>
          <div className={styles.tabContent}>
            {imageKeys1.map((imgKey, index) => (
              <div key={imgKey}>
                {visitatecnica && visitatecnica[imgKey] === null ? (
                  <FaImage onClick={() => onShowSubirImg(imgKey)} />
                ) : visitatecnica && visitatecnica[imgKey] ? (
                  <>
                    <Image src={visitatecnica[imgKey]} onClick={() => openImg(visitatecnica[imgKey], imgKey)} />
                    <h1>{visitatecnica[`title${index + 1}`] || 'Sin título'}</h1>
                    <div
                      className={styles.editTitle}
                      onClick={() =>
                        handleEditTitle(visitatecnica[`title${index + 1}`], `title${index + 1}`)
                      }
                    >
                      <FaEdit />
                    </div>
                  </>
                ) : null}
              </div>
            ))}

          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Después',
      render: () => (
        <Tab.Pane>
          <div className={styles.tabContent}>
            {imageKeys2.map((imgKey, index) => (
              <div key={imgKey}>
                {visitatecnica && visitatecnica[imgKey] === null ? (
                  <FaImage onClick={() => onShowSubirImg(imgKey)} />
                ) : visitatecnica && visitatecnica[imgKey] ? (
                  <>
                    <Image src={visitatecnica[imgKey]} onClick={() => openImg(visitatecnica[imgKey], imgKey)} />
                    <h1>{visitatecnica[`title${index + 11}`] || 'Sin título'}</h1>
                    <div
                      className={styles.editTitle}
                      onClick={() =>
                        handleEditTitle(visitatecnica[`title${index + 11}`], `title${index + 11}`)
                      }
                    >
                      <FaEdit />
                    </div>
                  </>
                ) : null}
              </div>
            ))}

          </div>
        </Tab.Pane>
      ),
    },
  ]


  return (
    <>
      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Orden de servicio</h1>
              <h2>{ordenservicio.nombre}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{ordenservicio.descripcion}</h2>
            </div>
            <div>
              <h1>Técnico</h1>
              <h2>{ordenservicio.usuario_nombre}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{ordenservicio.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDate(ordenservicio.date)}</h2>
            </div>
            <div>
              <h1>VT</h1>
              <h2>{
                ordenservicio.folioref ?
                  ordenservicio.folioref : 'N/A'
              }
              </h2>
            </div>
          </div>
        </div>

        <div className={styles.toogleEvi}>
          {ordenservicio.folioref != null && (
            <>
              <h1>Evidencias</h1>
              {toggleEviOS ?
                <div className={styles.toggleON}><BiSolidToggleRight onClick={onToggleEviOS} /></div> :
                <div className={styles.toggleOFF}><BiSolidToggleLeft onClick={onToggleEviOS} /></div>
              }
            </>
          )}
        </div>


        {toggleEviOS ?
          <div className={styles.mainImg}>
            <Tab panes={panes} className={styles.mainTab} />
          </div> : null
        }

        <div className={styles.formNota}>
          <Form>
            <FormGroup>
              <FormField>
                <Label>
                  Nota:
                </Label>
                <TextArea
                  value={nota}
                  onChange={handleNotaChange}
                  placeholder="Escribe una nota aquí..."
                />
                <div className={styles.charCount}>
                  {nota.length}/{maxCharacters}
                </div>
              </FormField>
            </FormGroup>
            <Button secondary onClick={handleAddNota}>
              {editNota ? 'Modificar nota' : 'Añadir nota'}
            </Button>
          </Form>
        </div>

        <div className={styles.imgFirma}>
          {firmaTec ? (
            <div>
              <Image src={firmaTec} alt="Firma Técnico" />
              <div className={styles.linea}></div>
              <h2>Firma Técnico</h2>
              <Button primary onClick={() => setShowConfirmFirmaTec(true)}><FaTrash /> Eliminar Firma Técnico</Button>
            </div>
          ) : (
            <Button primary onClick={onOpenCloseFirmaTec}><FaPlus /> Agregar Firma Técnico</Button>
          )}
        </div>

        <div className={styles.imgFirma}>
          {firmaCli ? (
            <div>
              <Image src={firmaCli} alt="Firma Cliente" />
              <div className={styles.linea}></div>
              <h2>Firma Cliente</h2>
              <Button primary onClick={() => setShowConfirmFirmaCli(true)}><FaTrash /> Eliminar Firma Cliente</Button>
            </div>
          ) : (
            <Button primary onClick={onOpenCloseFirmaCli}><FaPlus /> Agregar Firma Cliente</Button>
          )}
        </div>

        <div className={styles.iconEdit}>
          <div><FaEdit onClick={onOpenEditOrdenservicio} /></div>
        </div>
        <div className={styles.iconDel}>
          <div><FaTrash onClick={() => setShowConfirmDel(true)} /></div>
        </div>

        <OrdenServicioPDF ordenservicio={ordenservicio} firmaTec={firmaTec} firmaCli={firmaCli} user={user} visitatecnica={visitatecnica} image={images} toggle={toggleEviOS} />

      </div>

      <BasicModal title="Modificar la órden de servicio" show={showEditOrdenservicio} onClose={onOpenEditOrdenservicio}>
        <OrdenServicioEditForm
          reload={reload}
          onReload={onReload}
          ordenservicio={ordenservicio}
          onOpenEditOrdenservicio={onOpenEditOrdenservicio}
          onToastSuccessMod={onToastSuccessMod}
        />
      </BasicModal>

      <BasicModal show={showImg} onClose={() => setShowImg(false)}>
        <ModalImg
          img={selectedImg}
          openImg={() => setShowImg(false)}
          onShowConfirmDelImg={() => onShowConfirmDelImg(imgKeyToDelete)}
          delImage={false}
        />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
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
        onConfirm={handleDeleteOrdenservicio}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar ?'
      />

      <BasicModal title="Firma del Técnico" show={showFirmaTecModal} onClose={onOpenCloseFirmaTec}>
        <FirmaDigital
          reload={reload}
          onReload={onReload}
          endPoint='ordenservicio'
          itemId={ordenservicio.id}
          tipoFirma="firmatec"
          onOpenClose={() => {
            onOpenCloseFirmaTec()
            fetchFirmaTec()
          }}
        />
      </BasicModal>

      <BasicModal title="Firma del Cliente" show={showFirmaCliModal} onClose={onOpenCloseFirmaCli}>
        <FirmaDigital
          reload={reload}
          onReload={onReload}
          endPoint='ordenservicio'
          itemId={ordenservicio.id}
          tipoFirma="firmacli"
          onOpenClose={() => {
            onOpenCloseFirmaCli()
            fetchFirmaCli()
          }}
        />
      </BasicModal>

      <Confirm
        open={showConfirmFirmaTec}
        onCancel={onOpenCloseConfirmFirmaTec}
        onConfirm={removeFirmaTec}
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
        content="¿Estás seguro de eliminar la firma del técnico?"
      />

      <Confirm
        open={showConfirmFirmaCli}
        onCancel={onOpenCloseConfirmFirmaCli}
        onConfirm={removeFirmaCli}
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
        content="¿Estás seguro de eliminar la firma del cliente?"
      />

    </>
  )
}
