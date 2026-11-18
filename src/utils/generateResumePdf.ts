import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

/**
 * Loads an image from a URL and converts it to a base64 JPEG data URL
 * so that jsPDF can embed it directly into the PDF.
 */
async function loadImageAsDataUrl(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth || img.width
        canvas.height = img.naturalHeight || img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(null)
          return
        }
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/jpeg', 0.95))
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => {
      resolve(null)
    }
    img.src = url
  })
}

/**
 * Generates a high-resolution QR code as a base64 PNG data URL.
 */
async function generateQrDataUrl(text: string): Promise<string | null> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 200,
      color: {
        dark: '#08121a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
  } catch (err) {
    console.error('Failed to generate QR code for', text, err)
    return null
  }
}

export async function generateResumePdf(): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Page Dimensions: 210 x 297 mm
  const pageWidth = 210
  const marginX = 12
  const contentWidth = pageWidth - marginX * 2 // 186 mm

  // Live links matching user specifications
  const musicMindUrl = 'https://ais-pre-z7meguzgpkxxpuajifaqdn-752094771694.asia-northeast1.run.app/'
  const dataSpaceUrl = 'https://dataofsmartsubha.netlify.app'
  const portfolioUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : 'https://ais-pre-sulpbmuvswuwy4aghpjmov-430241317112.asia-southeast1.run.app/'

  // Pre-load assets
  const [photoData, logoData, musicQrData, dataQrData, portfolioQrData] = await Promise.all([
    loadImageAsDataUrl('/assets/aistudio/Subhajit-Sanpui_e673953e.jpg'),
    loadImageAsDataUrl('/assets/aistudio/file_00000000a2448208884829e99b4d5c60_6d4687cd.png'),
    generateQrDataUrl(musicMindUrl),
    generateQrDataUrl(dataSpaceUrl),
    generateQrDataUrl(portfolioUrl),
  ])

  // Color Definitions
  const darkHeader = [8, 18, 26] // #08121a
  const limeGreen = [132, 204, 22] // #84cc16
  const emeraldGreen = [21, 128, 61] // #15803d
  const coralRed = [185, 28, 28] // #b91c1c
  const slate900 = [15, 23, 42]
  const slate700 = [51, 65, 85]
  const slate500 = [100, 116, 139]
  const lineBorder = [226, 232, 240]

  // ==========================================
  // 1. TOP DARK HEADER BAR
  // ==========================================
  const headerY = 10
  const headerH = 38
  doc.setFillColor(darkHeader[0], darkHeader[1], darkHeader[2])
  doc.roundedRect(marginX, headerY, contentWidth, headerH, 2.5, 2.5, 'F')

  // Top Left: Name & Credentials
  const textLeftX = marginX + 5
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16.5)
  doc.setTextColor(248, 250, 252)
  doc.text('SUBHAJIT SANPUI', textLeftX, headerY + 8)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(limeGreen[0], limeGreen[1], limeGreen[2])
  doc.text('CLASS 10 SCHOLAR (BATCH 2027) · ASPIRING CARDIOLOGIST · WEB BUILDER', textLeftX, headerY + 13.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.2)
  doc.setTextColor(203, 213, 225)
  doc.text('WhatsApp: +91 86702 25411   |   Location: West Bengal, India', textLeftX, headerY + 19)
  doc.text('Instagram: @SMARTXSUBHA   |   Facebook: SUBHAJIT SANPUI', textLeftX, headerY + 23.5)

  // 3 Pill Badges in Header
  const badgeY = headerY + 28
  const drawBadge = (label: string, bg: number[], border: number[], textC: number[], x: number) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(5.8)
    const padX = 2.5
    const w = doc.getTextWidth(label) + padX * 2
    const h = 5.2

    doc.setFillColor(bg[0], bg[1], bg[2])
    doc.roundedRect(x, badgeY, w, h, 1, 1, 'F')
    doc.setDrawColor(border[0], border[1], border[2])
    doc.setLineWidth(0.2)
    doc.roundedRect(x, badgeY, w, h, 1, 1, 'S')

    doc.setTextColor(textC[0], textC[1], textC[2])
    doc.text(label, x + padX, badgeY + 3.7)
    return w + 2.5
  }

  let curBadgeX = textLeftX
  curBadgeX += drawBadge('WBBSE BOARD 2027', [5, 32, 23], [21, 128, 61], [74, 222, 128], curBadgeX)
  curBadgeX += drawBadge('PRE-MEDICINE TRACK', [40, 15, 18], [153, 27, 27], [248, 113, 113], curBadgeX)
  drawBadge('FRONTEND WEB DEV', [12, 35, 51], [3, 105, 161], [56, 189, 248], curBadgeX)

  // Top Right: Subhajit's Photo
  const photoW = 24
  const photoH = 30
  const photoX = marginX + contentWidth - photoW - 4
  const photoY = headerY + 4
  if (photoData) {
    try {
      doc.addImage(photoData, 'JPEG', photoX, photoY, photoW, photoH)
      doc.setDrawColor(limeGreen[0], limeGreen[1], limeGreen[2])
      doc.setLineWidth(0.6)
      doc.rect(photoX, photoY, photoW, photoH, 'S')
    } catch {
      // Fallback
    }
  }

  // ==========================================
  // ECG WAVEFORM DIVIDER (Neon Green)
  // ==========================================
  let curY = headerY + headerH + 3.5
  doc.setDrawColor(limeGreen[0], limeGreen[1], limeGreen[2])
  doc.setLineWidth(0.4)
  // ECG Spike shape
  const midX = marginX + contentWidth / 2
  doc.line(marginX, curY, midX - 25, curY)
  doc.line(midX - 25, curY, midX - 18, curY)
  doc.line(midX - 18, curY, midX - 14, curY - 1.5) // P wave
  doc.line(midX - 14, curY - 1.5, midX - 10, curY)
  doc.line(midX - 10, curY, midX - 8, curY + 1.5) // Q
  doc.line(midX - 8, curY + 1.5, midX - 4, curY - 4.5) // R peak
  doc.line(midX - 4, curY - 4.5, midX, curY + 3) // S
  doc.line(midX, curY + 3, midX + 3, curY)
  doc.line(midX + 3, curY, midX + 8, curY)
  doc.line(midX + 8, curY, midX + 13, curY - 1.5) // T wave
  doc.line(midX + 13, curY - 1.5, midX + 18, curY)
  doc.line(midX + 18, curY, marginX + contentWidth, curY)

  curY += 6

  // Section Heading Helper
  const drawHeading = (title: string) => {
    // Green square
    doc.setFillColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2])
    doc.roundedRect(marginX, curY - 3, 3, 3, 0.4, 0.4, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.8)
    doc.setTextColor(slate900[0], slate900[1], slate900[2])
    const titleX = marginX + 4.5
    doc.text(title, titleX, curY - 0.5)

    const titleW = doc.getTextWidth(title)
    doc.setDrawColor(lineBorder[0], lineBorder[1], lineBorder[2])
    doc.setLineWidth(0.3)
    doc.line(titleX + titleW + 2, curY - 0.8, marginX + contentWidth, curY - 0.8)

    curY += 4.5
  }

  // ==========================================
  // SECTION 1: EXECUTIVE PROFILE & CAREER VISION
  // ==========================================
  drawHeading('EXECUTIVE PROFILE & CAREER VISION')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.6)
  doc.setTextColor(slate700[0], slate700[1], slate700[2])
  const profileLines = doc.splitTextToSize(
    'Focused Class 10 student (WBBSE Batch 2027) with an unwavering commitment to becoming a professional Cardiologist and medical technologist. Harmonizing deep pre-medical biological sciences (cardiac electrophysiology, hemodynamics, myocardial mechanics) with self-driven computational engineering (HTML, CSS, TypeScript, and modern web systems) to pioneer empathetic, data-driven patient monitoring solutions for tomorrow’s clinical practice.',
    contentWidth
  )
  doc.text(profileLines, marginX, curY)
  curY += profileLines.length * 3.4 + 4

  // ==========================================
  // SECTION 2: EDUCATION & MEDICAL ENTRANCE ROADMAP
  // ==========================================
  drawHeading('EDUCATION & MEDICAL ENTRANCE ROADMAP')

  // Item 1: Class 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.3)
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2])
  doc.text('Secondary Examination (Madhyamik / Class 10)', marginX, curY)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.2)
  doc.setTextColor(slate700[0], slate700[1], slate700[2])
  doc.text('2026 – 2027 [ACTIVE]', marginX + contentWidth, curY, { align: 'right' })

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(6.8)
  doc.setTextColor(slate500[0], slate500[1], slate500[2])
  doc.text('West Bengal Board of Secondary Education (WBBSE)', marginX, curY + 3.4)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.2)
  doc.setTextColor(slate700[0], slate700[1], slate700[2])
  doc.text(
    'Focus: Biological Sciences, Physical Sciences & Mathematics. Building academic rigor and board excellence.',
    marginX,
    curY + 6.8
  )
  curY += 10.5

  // Item 2: Class 11-12 & NEET
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.3)
  doc.setTextColor(coralRed[0], coralRed[1], coralRed[2])
  doc.text('Higher Secondary Science (10+2) & NEET-UG Pre-Medical', marginX, curY)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.2)
  doc.setTextColor(slate700[0], slate700[1], slate700[2])
  doc.text('2027 – 2029 [TARGET]', marginX + contentWidth, curY, { align: 'right' })

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(6.8)
  doc.setTextColor(slate500[0], slate500[1], slate500[2])
  doc.text('Physics, Chemistry & Advanced Cellular Biology Specialization', marginX, curY + 3.4)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.2)
  doc.setTextColor(slate700[0], slate700[1], slate700[2])
  doc.text(
    'Competitive preparation for National Eligibility cum Entrance Test (NEET-UG) targeting premier Medical Colleges.',
    marginX,
    curY + 6.8
  )
  curY += 10.5

  // Item 3: MBBS & DM
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.3)
  doc.setTextColor(slate900[0], slate900[1], slate900[2])
  doc.text('MBBS Medical Degree & Cardiology Specialization (MD / DM)', marginX, curY)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.2)
  doc.setTextColor(slate700[0], slate700[1], slate700[2])
  doc.text('2030 – 2035+ [LIFE MISSION]', marginX + contentWidth, curY, { align: 'right' })

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(6.8)
  doc.setTextColor(slate500[0], slate500[1], slate500[2])
  doc.text(
    'Cardiovascular Diagnostics, Clinical Rotations & Interventional Cardiology',
    marginX,
    curY + 3.4
  )

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.2)
  doc.setTextColor(slate700[0], slate700[1], slate700[2])
  doc.text(
    'Mastery of echocardiography, angiographic interventions, arrhythmia management, and digital cardiac care.',
    marginX,
    curY + 6.8
  )
  curY += 11.5

  // ==========================================
  // SECTION 3: DUAL COMPETENCIES & TECHNICAL FOUNDATION
  // ==========================================
  drawHeading('DUAL COMPETENCIES & TECHNICAL FOUNDATION')

  const cardW = (contentWidth - 4) / 2
  const card1X = marginX
  const card2X = marginX + cardW + 4
  const cardH = 26

  // Box 1: Cardiology
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(card1X, curY, cardW, cardH, 1.5, 1.5, 'F')
  doc.setDrawColor(lineBorder[0], lineBorder[1], lineBorder[2])
  doc.setLineWidth(0.3)
  doc.roundedRect(card1X, curY, cardW, cardH, 1.5, 1.5, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.2)
  doc.setTextColor(coralRed[0], coralRed[1], coralRed[2])
  doc.text('CARDIOLOGY & BIOMEDICAL', card1X + 3, curY + 4.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.7)
  doc.setTextColor(slate700[0], slate700[1], slate700[2])
  const cardioBullets = [
    '• 4-Chamber Heart Anatomy & Valvular Bloodflow',
    '• Intrinsic Conduction: SA Node, AV Node, Purkinje',
    '• ECG Waveform Analysis: P, QRS, ST & T Morphology',
    '• Systemic & Pulmonary Hemodynamics Dynamics',
  ]
  let c1Y = curY + 9
  cardioBullets.forEach((b) => {
    doc.text(b, card1X + 3, c1Y)
    c1Y += 4.1
  })

  // Box 2: Web Dev
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(card2X, curY, cardW, cardH, 1.5, 1.5, 'F')
  doc.setDrawColor(lineBorder[0], lineBorder[1], lineBorder[2])
  doc.setLineWidth(0.3)
  doc.roundedRect(card2X, curY, cardW, cardH, 1.5, 1.5, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.2)
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2])
  doc.text('WEB DEVELOPMENT & COMPUTING', card2X + 3, curY + 4.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.7)
  doc.setTextColor(slate700[0], slate700[1], slate700[2])
  const webBullets = [
    '• HTML5 Semantic Page Structure (80% Proficiency)',
    '• Modern CSS3, Flexbox, Grid & Tailwind Framework',
    '• Responsive Mobile & Desktop Layout Engineering',
    '• Git Version Control & Netlify / Cloud Deployments',
  ]
  let c2Y = curY + 9
  webBullets.forEach((b) => {
    doc.text(b, card2X + 3, c2Y)
    c2Y += 4.1
  })

  curY += cardH + 5

  // ==========================================
  // SECTION 4: FEATURED LIVE DEPLOYMENTS (SCAN QR TO OPEN)
  // ==========================================
  drawHeading('FEATURED LIVE DEPLOYMENTS (SCAN QR TO OPEN)')

  // Project 1 Card: Music Mind
  const pCardH = 19
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(marginX, curY, contentWidth, pCardH, 1.5, 1.5, 'F')
  doc.setDrawColor(lineBorder[0], lineBorder[1], lineBorder[2])
  doc.setLineWidth(0.3)
  doc.roundedRect(marginX, curY, contentWidth, pCardH, 1.5, 1.5, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.8)
  doc.setTextColor(slate900[0], slate900[1], slate900[2])
  doc.text('01 / Music Mind — Interactive Audio Beats Web Application', marginX + 3.5, curY + 4.5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2])
  doc.text('LIVE ON CLOUD', marginX + contentWidth - 25, curY + 4.5, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.8)
  doc.setTextColor(slate700[0], slate700[1], slate700[2])
  doc.text(
    'Interactive web application engineered for audio beat experimentation, sound synthesis, and real-time playback.',
    marginX + 3.5,
    curY + 9
  )

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.6)
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2])
  doc.text('Tap or scan the real QR code to test beats live !—', marginX + 3.5, curY + 14.5)
  doc.link(marginX + 3.5, curY + 12, 80, 5, { url: musicMindUrl })

  // Music Mind QR
  if (musicQrData) {
    const qSize = 14
    const qX = marginX + contentWidth - qSize - 3
    doc.addImage(musicQrData, 'PNG', qX, curY + 1.5, qSize, qSize)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(5.2)
    doc.setTextColor(slate700[0], slate700[1], slate700[2])
    doc.text('SCAN TO PLAY', qX + qSize / 2, curY + pCardH - 1, { align: 'center' })
    doc.link(qX, curY + 1.5, qSize, qSize, { url: musicMindUrl })
  }

  curY += pCardH + 3.5

  // Project 2 Card: My Data Space
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(marginX, curY, contentWidth, pCardH, 1.5, 1.5, 'F')
  doc.setDrawColor(lineBorder[0], lineBorder[1], lineBorder[2])
  doc.setLineWidth(0.3)
  doc.roundedRect(marginX, curY, contentWidth, pCardH, 1.5, 1.5, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.8)
  doc.setTextColor(slate900[0], slate900[1], slate900[2])
  doc.text('02 / My Data Space — Secure Personal Repository & Vault', marginX + 3.5, curY + 4.5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2])
  doc.text('LIVE ON NETLIFY', marginX + contentWidth - 25, curY + 4.5, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.8)
  doc.setTextColor(slate700[0], slate700[1], slate700[2])
  doc.text(
    'Clean personal repository utility designed to store critical documents, reference notes, and vital resources securely.',
    marginX + 3.5,
    curY + 9
  )

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.6)
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2])
  doc.text('Tap or scan the real QR code to open personal vault !—', marginX + 3.5, curY + 14.5)
  doc.link(marginX + 3.5, curY + 12, 80, 5, { url: dataSpaceUrl })

  // Data Space QR
  if (dataQrData) {
    const qSize = 14
    const qX = marginX + contentWidth - qSize - 3
    doc.addImage(dataQrData, 'PNG', qX, curY + 1.5, qSize, qSize)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(5.2)
    doc.setTextColor(slate700[0], slate700[1], slate700[2])
    doc.text('SCAN TO OPEN', qX + qSize / 2, curY + pCardH - 1, { align: 'center' })
    doc.link(qX, curY + 1.5, qSize, qSize, { url: dataSpaceUrl })
  }

  curY += pCardH + 3.5

  // Bottom Dark Card: Official Portfolio & Interactive Lab
  const darkCardH = 20
  doc.setFillColor(darkHeader[0], darkHeader[1], darkHeader[2])
  doc.roundedRect(marginX, curY, contentWidth, darkCardH, 2, 2, 'F')

  // Left Avatar in circle
  const dAvatarSize = 13
  const dAvatarX = marginX + 3.5
  const dAvatarY = curY + 3.5
  if (logoData) {
    try {
      doc.addImage(logoData, 'JPEG', dAvatarX, dAvatarY, dAvatarSize, dAvatarSize)
      doc.setDrawColor(56, 189, 248)
      doc.setLineWidth(0.4)
      doc.circle(dAvatarX + dAvatarSize / 2, dAvatarY + dAvatarSize / 2, dAvatarSize / 2, 'S')
    } catch {
      // Fallback
    }
  }

  // Middle Text
  const dTextX = dAvatarX + dAvatarSize + 4
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.6)
  doc.setTextColor(limeGreen[0], limeGreen[1], limeGreen[2])
  doc.text('OFFICIAL DIGITAL PORTFOLIO & INTERACTIVE LAB', dTextX, curY + 5.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.6)
  doc.setTextColor(203, 213, 225)
  doc.text(
    'Experience real-time ECG simulation, interactive cardiovascular roadmap, and contact channels.',
    dTextX,
    curY + 10
  )

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.4)
  doc.setTextColor(248, 113, 113)
  doc.text('Scan the QR code on the right with any phone camera to visit instantly', dTextX, curY + 15)

  // Portfolio QR
  if (portfolioQrData) {
    const qSize = 14
    const qX = marginX + contentWidth - qSize - 3
    doc.addImage(portfolioQrData, 'PNG', qX, curY + 2, qSize, qSize)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(5.2)
    doc.setTextColor(limeGreen[0], limeGreen[1], limeGreen[2])
    doc.text('PORTFOLIO QR', qX + qSize / 2, curY + darkCardH - 1, { align: 'center' })
    doc.link(qX, curY + 2, qSize, qSize, { url: portfolioUrl })
  }

  // ==========================================
  // FOOTER
  // ==========================================
  const footerY = 288
  doc.setDrawColor(lineBorder[0], lineBorder[1], lineBorder[2])
  doc.setLineWidth(0.3)
  doc.line(marginX, footerY, marginX + contentWidth, footerY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.3)
  doc.setTextColor(slate500[0], slate500[1], slate500[2])
  doc.text(
    'Subhajit Sanpui · Curriculum Vitae · WBBSE Batch 2027 · Future Cardiologist',
    marginX,
    footerY + 4
  )
  doc.text('Designed & Built with Code by Subhajit Sanpui', marginX + contentWidth, footerY + 4, {
    align: 'right',
  })

  // Trigger download
  doc.save('Subhajit_Sanpui_Curriculum_Vitae.pdf')
}
