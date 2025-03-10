import { BiSolidFilePdf } from 'react-icons/bi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'
import { formatDate } from '@/helpers'
import styles from './OrdenServicioPDF.module.css'

export function OrdenServicioPDF(props) {

  const { ordenservicio, firmaCli, firmaTec, visitatecnica, image, toggle } = props

  const generarPDF = async () => {

    if (!ordenservicio) return

    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      }
    )

    const addFooterText = () => {
      const text = 'www.clicknetmx.com'
      const textWidth = doc.getTextWidth(text)
      const x = (pageWidth - textWidth) / 2
      const y = doc.internal.pageSize.height - 5 
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text(text, x, y)
    }

    const logoImg = 'img/logo.png'
    const logoWidth = 58
    const logoHeight = 16
    const marginRightLogo = 12

    const pageWidth = doc.internal.pageSize.getWidth()

    const xPosition = pageWidth - logoWidth - marginRightLogo

    doc.addImage(logoImg, 'PNG', xPosition, 18, logoWidth, logoHeight)

    doc.setFont('helvetica')

    const marginMain = 12
    const marginRight = 12
    const font1 = 12
    const font2 = 10
    const font3 = 9

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('CLICKNET', 15, 23)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text('Punta Este Corporativo', 15, 27)
    doc.text('Calzada Carranza 951', 15, 31)
    doc.text('Piso 10 Suite 304, Interior "E"', 15, 35)
    doc.text('C.P. 2125', 15, 39)
    doc.setFontSize(`${font3}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Juan Roberto Espinoza Espinoza', 15, 43)
    doc.setFontSize(`${font3}`)
    doc.setTextColor(120, 120, 120)
    doc.text('RFC: EIEJ8906244J3', 15, 47)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Cliente', 15, 60)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${ordenservicio.residencial_nombre}`, 15, 64)

    doc.setFontSize(`${font1}`)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text('ORDEN DE SERVICIO', doc.internal.pageSize.width - marginRight - doc.getTextWidth('ORDEN DE SERVICIO'), 44)
    doc.setFontSize(`${font2}`)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.text('Folio', doc.internal.pageSize.width - marginRight - doc.getTextWidth('Folio'), 50)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${ordenservicio.folio}`, doc.internal.pageSize.width - marginRight - doc.getTextWidth(`${ordenservicio.folio}`), 54)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Fecha', doc.internal.pageSize.width - marginRight - doc.getTextWidth('Fecha'), 60)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(
      `${formatDate(ordenservicio.date)}`,
      doc.internal.pageSize.width - 12 - doc.getTextWidth(`${formatDate(ordenservicio.date)}`),
      64
    )

    doc.autoTable({
      startY: 75,
      head: [
        [
          { content: 'Descripción', styles: { halign: 'left' } }
        ]
      ],
      styles: {
        cellPadding: 2.5,
        cellWidth: 'auto',
      },
      body: [[ordenservicio.descripcion || 'Sin descripción']],
      headStyles: { fillColor: [240, 240, 240], fontSize: `${font2}`, textColor: [50, 50, 50] },
      bodyStyles: { fontSize: `${font3}` },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      columnStyles: {
        0: {
          halign: 'left', 
          cellWidth: 'auto',
          cellPadding: 2.5,
          valign: 'middle'
        }
      },

      margin: { top: 0, left: marginMain, bottom: 0, right: marginMain },

    })

    const top = 230
    const boxWidth = 185
    const boxHeight = 30

    doc.setDrawColor(255, 255, 255)
    doc.rect(marginMain, top, boxWidth, boxHeight)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0);
    doc.text('Nota:', marginMain, top - 1)

    doc.setFontSize(`${font3}`)
    doc.setTextColor(80, 80, 80)
    const content = ordenservicio.nota === undefined || ordenservicio.nota === null ? (
      ''
    ) : (
      `${ordenservicio.nota}`
    )

    const textX = marginMain
    const textY = top + 4
    const txtWidth = boxWidth - 4

    doc.text(content, textX, textY, { maxWidth: txtWidth })

    const firmaWidth = 24
    const firmaHeight = 12
    const marginRightFirmaTec = 40
    const marginRightFirmaCli = 110
    const xPos = pageWidth - firmaWidth - marginRightFirmaTec
    const xPosCli = pageWidth - firmaWidth - marginRightFirmaCli

    if (firmaTec) {
      doc.addImage(firmaTec, 'PNG', xPos, 264, firmaWidth, firmaHeight)
    }
    doc.setFontSize(`${font3}`)
    doc.setTextColor(50, 50, 50)
    doc.text('_________________________', doc.internal.pageSize.width - 55 - doc.getTextWidth('Firma Técnico'), 278)
    doc.text('Firma Técnico', doc.internal.pageSize.width - 43.5 - doc.getTextWidth('Firma Técnico'), 282.5)

    if (firmaCli) {
      doc.addImage(firmaCli, 'PNG', xPosCli, 264, firmaWidth, firmaHeight)
    }
    doc.setFontSize(`${font3}`)
    doc.setTextColor(50, 50, 50)
    doc.text('_________________________', doc.internal.pageSize.width - 125 - doc.getTextWidth('Firma Cliente'), 278)
    doc.text('Firma Cliente', doc.internal.pageSize.width - 112 - doc.getTextWidth('Firma Cliente'), 282.5)

    const qrCodeText = 'https://www.facebook.com/clicknet.mx'
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText)
    doc.addImage(qrCodeDataUrl, 'PNG', 10, 248, 40, 40)

    doc.setFontSize(`${font3}`)
    doc.setTextColor(120, 120, 120)

    addFooterText()

    if (toggle) {

      const imgWidth = 35
      const imgHeight = 70
      const spaceBetweenImages = 45
      const imagesPerRow = 4;

      function calculateInitialPosX(docWidth) {
        const totalImagesWidth = imagesPerRow * imgWidth + (imagesPerRow - 1) * (spaceBetweenImages - imgWidth)
        return (docWidth - totalImagesWidth) / 2
      }

      doc.addPage();
      doc.autoTable({
        startY: 10,
        head: [[{ content: 'Evidencias Antes del Servicio', styles: { halign: 'left' } }]],
        headStyles: { fillColor: [240, 240, 240], fontSize: font2, textColor: [50, 50, 50] },
        margin: { top: 0, left: marginMain, right: marginMain },
      })

      addFooterText()

      const imgAntes = [
        { img: visitatecnica.img1, title: visitatecnica.title1 },
        { img: visitatecnica.img2, title: visitatecnica.title2 },
        { img: visitatecnica.img3, title: visitatecnica.title3 },
        { img: visitatecnica.img4, title: visitatecnica.title4 },
        { img: visitatecnica.img5, title: visitatecnica.title5 },
        { img: visitatecnica.img6, title: visitatecnica.title6 },
        { img: visitatecnica.img7, title: visitatecnica.title7 },
        { img: visitatecnica.img8, title: visitatecnica.title8 },
        { img: visitatecnica.img9, title: visitatecnica.title9 },
        { img: visitatecnica.img10, title: visitatecnica.title10 }
      ]

      let firstRowTopMargin = 26
      let posY = firstRowTopMargin
      let posX = calculateInitialPosX(doc.internal.pageSize.width)

      imgAntes.forEach((item, index) => {
        if (item.img) {
          doc.addImage(item.img, 'PNG', posX, posY, imgWidth, imgHeight)

          if (item.title) {
            doc.setFontSize(font3)
            doc.setTextColor(0, 0, 0)
            doc.text(item.title, posX + imgWidth / 2, posY + imgHeight + 5, { maxWidth: imgWidth, align: 'center' })
          }
        }

        posX += spaceBetweenImages

        if ((index + 1) % imagesPerRow === 0) {
          posX = calculateInitialPosX(doc.internal.pageSize.width)
          posY += 88
        }
      })

      doc.addPage()
      doc.autoTable({
        startY: 10,
        head: [[{ content: 'Evidencias Después del Servicio', styles: { halign: 'left' } }]],
        headStyles: { fillColor: [240, 240, 240], fontSize: font2, textColor: [50, 50, 50] },
        margin: { top: 0, left: marginMain, right: marginMain },
      })

      const imgDespues = [
        { img: visitatecnica.img11, title: visitatecnica.title11 },
        { img: visitatecnica.img12, title: visitatecnica.title12 },
        { img: visitatecnica.img13, title: visitatecnica.title13 },
        { img: visitatecnica.img14, title: visitatecnica.title14 },
        { img: visitatecnica.img15, title: visitatecnica.title15 },
        { img: visitatecnica.img16, title: visitatecnica.title16 },
        { img: visitatecnica.img17, title: visitatecnica.title17 },
        { img: visitatecnica.img18, title: visitatecnica.title18 },
        { img: visitatecnica.img19, title: visitatecnica.title19 },
        { img: visitatecnica.img20, title: visitatecnica.title20 }
      ]

      posY = firstRowTopMargin
      posX = calculateInitialPosX(doc.internal.pageSize.width) 

      addFooterText()

      imgDespues.forEach((item, index) => {
        if (item.img) {
          doc.addImage(item.img, 'PNG', posX, posY, imgWidth, imgHeight)

          if (item.title) {
            doc.setFontSize(font3)
            doc.setTextColor(0, 0, 0)
            doc.text(item.title, posX + imgWidth / 2, posY + imgHeight + 5, { maxWidth: imgWidth, align: 'center' })
          }
        }

        posX += spaceBetweenImages;

        if ((index + 1) % imagesPerRow === 0) {
          posX = calculateInitialPosX(doc.internal.pageSize.width)
          posY += 88
        }
      })

    }

    doc.save(`ordenservicio_${ordenservicio.folio}.pdf`)

  }

  const compartirPDF = () => {

    generarPDF()
  }

  return (

    <div className={styles.iconPDF}>
      <div onClick={compartirPDF}>
        <BiSolidFilePdf />
      </div>
    </div>

  )
}
