export interface Vehicle {
  id: number
  qrCode: string
  kennzeichen: string
  fin: string
  marke: string
  modell: string
  status: string
  standort: string
  firma: string
  zugewiesenAn: string
  erstzulassung: string
  letzteUebergabe: string
  beschaffungsart: string
  beklebt: boolean
  servicefahrzeug: boolean
  inventartyp: string
  gesamtgewicht: string
  versicherung: string
  versicherungsnr: string
  kmStand: number
  farbe: string
  baujahr: string
}

export interface Handover {
  id: number
  kennzeichen: string
  kmStand: number
  uebergebenVon: string
  uebergebenZu: string
  vonStation: string
  anStation: string
  datum: string
  erstelltVon: string
  bestaetigt: boolean
}

export interface WorkshopOrder {
  id: number
  kennzeichen: string
  station: string
  eingebracht: string
  abgeholt: string | null
  verweildauer: string
  bemerkung: string
  schaeden: string
  status: 'Neu' | 'Geprüft' | 'Abgeschlossen'
  erstelltVon: string
}

export interface Accident {
  id: number
  datum: string
  kennzeichen: string
  station: string
  personalnummer: string
  fahrer: string
  abgearbeitet: boolean
  bearbeitungsstatus: 'nicht abgearbeitet' | 'In Bearbeitung' | 'Abgearbeitet'
  sachbearbeiter: string
  schuldart: string
  beschreibung: string
}

export interface Offense {
  id: number
  datum: string
  kennzeichen: string
  personalnummer: string
  fahrer: string
  verstoss: string
  bussgeld: number
  aktenzeichen: string
  bestaetigt: boolean
  behoerde: string
}

export interface Tour {
  id: number
  tourId: string
  tourNr: string
  standort: string
  pid: string
  fahrer: string
  kennzeichen: string
  retouren: number
  infos: string
  datum: string
  tourType: 'Normal' | 'Extra' | 'Rescue' | 'SUB Rescue' | 'Abwesend'
}

export interface InventoryItem {
  id: number
  kennzeichen: string
  fin: string
  standort: string
  inventurTyp: string
  status: string
  inventurFertig: boolean
  letztesInventurdatum: string
}

export const mockVehicles: Vehicle[] = [
  {
    id: 1,
    qrCode: 'GF-001',
    kennzeichen: 'B-ER 5720',
    fin: 'WV2ZZZ2HZ9H045231',
    marke: 'Volkswagen',
    modell: 'Crafter',
    status: 'Werkstatt',
    standort: 'DHH1-Hamburg',
    firma: 'EuRide',
    zugewiesenAn: 'Mohamed Al-Rashidi',
    erstzulassung: '2019-03-15',
    letzteUebergabe: '2024-11-20',
    beschaffungsart: 'Leasing',
    beklebt: true,
    servicefahrzeug: false,
    inventartyp: 'Zustellfahrzeug',
    gesamtgewicht: '3500 kg',
    versicherung: 'Allianz',
    versicherungsnr: 'ALZ-2023-88421',
    kmStand: 142350,
    farbe: 'Weiß',
    baujahr: '2019',
  },
  {
    id: 2,
    qrCode: 'GF-002',
    kennzeichen: 'B-ER 5721',
    fin: 'WV2ZZZ2HZ9H045232',
    marke: 'Volkswagen',
    modell: 'Crafter',
    status: 'im Einsatz',
    standort: 'DHH1-Hamburg',
    firma: 'EuRide',
    zugewiesenAn: 'Fatima Özdemir',
    erstzulassung: '2020-06-01',
    letzteUebergabe: '2024-12-01',
    beschaffungsart: 'Leasing',
    beklebt: true,
    servicefahrzeug: false,
    inventartyp: 'Zustellfahrzeug',
    gesamtgewicht: '3500 kg',
    versicherung: 'AXA',
    versicherungsnr: 'AXA-2023-55231',
    kmStand: 89200,
    farbe: 'Weiß',
    baujahr: '2020',
  },
  {
    id: 3,
    qrCode: 'GF-003',
    kennzeichen: 'HH-GF 1234',
    fin: 'WDB9066351L346921',
    marke: 'Mercedes-Benz',
    modell: 'Sprinter',
    status: 'im Einsatz',
    standort: 'DHH1-Hamburg',
    firma: 'EuRide',
    zugewiesenAn: 'Klaus Müller',
    erstzulassung: '2021-01-10',
    letzteUebergabe: '2024-11-28',
    beschaffungsart: 'Kauf',
    beklebt: true,
    servicefahrzeug: false,
    inventartyp: 'Zustellfahrzeug',
    gesamtgewicht: '3500 kg',
    versicherung: 'HUK-COBURG',
    versicherungsnr: 'HUK-2022-77845',
    kmStand: 67890,
    farbe: 'Weiß',
    baujahr: '2021',
  },
  {
    id: 4,
    qrCode: 'GF-004',
    kennzeichen: 'HB-GF 5678',
    fin: 'WDB9066351L346922',
    marke: 'Mercedes-Benz',
    modell: 'Sprinter',
    status: 'Puffer',
    standort: 'DHB1-Bremen',
    firma: 'EuRide',
    zugewiesenAn: '',
    erstzulassung: '2020-09-20',
    letzteUebergabe: '2024-10-15',
    beschaffungsart: 'Leasing',
    beklebt: false,
    servicefahrzeug: false,
    inventartyp: 'Zustellfahrzeug',
    gesamtgewicht: '3500 kg',
    versicherung: 'Allianz',
    versicherungsnr: 'ALZ-2022-33412',
    kmStand: 115600,
    farbe: 'Weiß',
    baujahr: '2020',
  },
  {
    id: 5,
    qrCode: 'GF-005',
    kennzeichen: 'MUC-GF 9012',
    fin: 'XLR0A7100G0001234',
    marke: 'Ford',
    modell: 'Transit',
    status: 'im Einsatz',
    standort: 'MUC1-Garching',
    firma: 'EuRide',
    zugewiesenAn: 'Hans Bauer',
    erstzulassung: '2022-03-05',
    letzteUebergabe: '2024-12-02',
    beschaffungsart: 'Leasing',
    beklebt: true,
    servicefahrzeug: false,
    inventartyp: 'Zustellfahrzeug',
    gesamtgewicht: '3100 kg',
    versicherung: 'DEVK',
    versicherungsnr: 'DEVK-2022-90123',
    kmStand: 44200,
    farbe: 'Weiß',
    baujahr: '2022',
  },
  {
    id: 6,
    qrCode: 'GF-006',
    kennzeichen: 'HH-GLS 3344',
    fin: 'WV2ZZZ2HZ9H045236',
    marke: 'Volkswagen',
    modell: 'Crafter',
    status: 'im Einsatz',
    standort: 'GLS25-Hamburg',
    firma: 'GLS',
    zugewiesenAn: 'Sergei Petrov',
    erstzulassung: '2021-07-15',
    letzteUebergabe: '2024-11-30',
    beschaffungsart: 'Leasing',
    beklebt: true,
    servicefahrzeug: false,
    inventartyp: 'Zustellfahrzeug',
    gesamtgewicht: '3500 kg',
    versicherung: 'AXA',
    versicherungsnr: 'AXA-2021-44567',
    kmStand: 78450,
    farbe: 'Weiß',
    baujahr: '2021',
  },
  {
    id: 7,
    qrCode: 'GF-007',
    kennzeichen: 'HH-DPD 7788',
    fin: 'WDB9066351L346927',
    marke: 'Mercedes-Benz',
    modell: 'Vito',
    status: 'im Einsatz',
    standort: 'DPDHamburg',
    firma: 'DPD',
    zugewiesenAn: 'Ibrahim Kaya',
    erstzulassung: '2023-01-20',
    letzteUebergabe: '2024-12-01',
    beschaffungsart: 'Kauf',
    beklebt: true,
    servicefahrzeug: false,
    inventartyp: 'Zustellfahrzeug',
    gesamtgewicht: '2800 kg',
    versicherung: 'HUK-COBURG',
    versicherungsnr: 'HUK-2023-12345',
    kmStand: 22100,
    farbe: 'Weiß',
    baujahr: '2023',
  },
  {
    id: 8,
    qrCode: 'GF-008',
    kennzeichen: 'SH-GF 4455',
    fin: 'XLR0A7100G0001238',
    marke: 'Ford',
    modell: 'Transit Custom',
    status: 'Puffer',
    standort: 'DSH4-Borgstedt',
    firma: 'EuRide',
    zugewiesenAn: '',
    erstzulassung: '2020-11-01',
    letzteUebergabe: '2024-09-10',
    beschaffungsart: 'Leasing',
    beklebt: false,
    servicefahrzeug: false,
    inventartyp: 'Zustellfahrzeug',
    gesamtgewicht: '2800 kg',
    versicherung: 'Allianz',
    versicherungsnr: 'ALZ-2020-65432',
    kmStand: 133500,
    farbe: 'Weiß',
    baujahr: '2020',
  },
  {
    id: 9,
    qrCode: 'GF-009',
    kennzeichen: 'DBW-GF 6677',
    fin: 'WDB9066351L346929',
    marke: 'Mercedes-Benz',
    modell: 'Sprinter',
    status: 'im Einsatz',
    standort: 'DBW8-Messkirchen',
    firma: 'AMZL',
    zugewiesenAn: 'Mehmet Yilmaz',
    erstzulassung: '2022-05-12',
    letzteUebergabe: '2024-11-25',
    beschaffungsart: 'Leasing',
    beklebt: true,
    servicefahrzeug: false,
    inventartyp: 'Zustellfahrzeug',
    gesamtgewicht: '3500 kg',
    versicherung: 'DEVK',
    versicherungsnr: 'DEVK-2022-33456',
    kmStand: 58900,
    farbe: 'Weiß',
    baujahr: '2022',
  },
  {
    id: 10,
    qrCode: 'GF-010',
    kennzeichen: 'B-ER 9900',
    fin: 'WV2ZZZ2HZ9H045240',
    marke: 'Volkswagen',
    modell: 'e-Crafter',
    status: 'abgemeldet',
    standort: 'DHH1-Hamburg',
    firma: 'EuRide',
    zugewiesenAn: '',
    erstzulassung: '2019-08-01',
    letzteUebergabe: '2024-07-01',
    beschaffungsart: 'Leasing',
    beklebt: false,
    servicefahrzeug: false,
    inventartyp: 'Zustellfahrzeug',
    gesamtgewicht: '3500 kg',
    versicherung: 'Allianz',
    versicherungsnr: 'ALZ-2019-11223',
    kmStand: 198000,
    farbe: 'Weiß',
    baujahr: '2019',
  },
  {
    id: 11,
    qrCode: 'GF-SRV-01',
    kennzeichen: 'HH-GF 5555',
    fin: 'WDB9066351L346931',
    marke: 'Mercedes-Benz',
    modell: 'Vito',
    status: 'im Einsatz',
    standort: 'DHH1-Hamburg',
    firma: 'EuRide',
    zugewiesenAn: 'Flottenmanager',
    erstzulassung: '2021-04-20',
    letzteUebergabe: '2024-11-01',
    beschaffungsart: 'Kauf',
    beklebt: false,
    servicefahrzeug: true,
    inventartyp: 'Servicefahrzeug',
    gesamtgewicht: '2800 kg',
    versicherung: 'HUK-COBURG',
    versicherungsnr: 'HUK-2021-99888',
    kmStand: 65200,
    farbe: 'Schwarz',
    baujahr: '2021',
  },
  {
    id: 12,
    qrCode: 'GF-012',
    kennzeichen: 'HH-GF 6666',
    fin: 'WDB9066351L346932',
    marke: 'Mercedes-Benz',
    modell: 'Sprinter',
    status: 'zurückgegeben',
    standort: 'DHH1-Hamburg',
    firma: 'EuRide',
    zugewiesenAn: '',
    erstzulassung: '2018-06-15',
    letzteUebergabe: '2024-06-30',
    beschaffungsart: 'Leasing',
    beklebt: false,
    servicefahrzeug: false,
    inventartyp: 'Zustellfahrzeug',
    gesamtgewicht: '3500 kg',
    versicherung: 'AXA',
    versicherungsnr: 'AXA-2018-44321',
    kmStand: 245800,
    farbe: 'Weiß',
    baujahr: '2018',
  },
]

export const mockHandovers: Handover[] = [
  {
    id: 1,
    kennzeichen: 'B-ER 5721',
    kmStand: 89200,
    uebergebenVon: 'Fatima Özdemir',
    uebergebenZu: 'Klaus Müller',
    vonStation: 'DHH1-Hamburg',
    anStation: 'DHH1-Hamburg',
    datum: '2024-12-01',
    erstelltVon: 'Admin',
    bestaetigt: true,
  },
  {
    id: 2,
    kennzeichen: 'B-ER 5720',
    kmStand: 142350,
    uebergebenVon: 'Mohamed Al-Rashidi',
    uebergebenZu: 'Werkstatt',
    vonStation: 'DHH1-Hamburg',
    anStation: 'Werkstatt Hamburg',
    datum: '2024-11-20',
    erstelltVon: 'Dispatcher',
    bestaetigt: true,
  },
  {
    id: 3,
    kennzeichen: 'HH-GF 1234',
    kmStand: 67890,
    uebergebenVon: 'Lager',
    uebergebenZu: 'Klaus Müller',
    vonStation: 'Depot',
    anStation: 'DHH1-Hamburg',
    datum: '2024-11-28',
    erstelltVon: 'Admin',
    bestaetigt: true,
  },
  {
    id: 4,
    kennzeichen: 'HH-DPD 7788',
    kmStand: 22100,
    uebergebenVon: 'DPD Depot',
    uebergebenZu: 'Ibrahim Kaya',
    vonStation: 'DPDHamburg',
    anStation: 'DPDHamburg',
    datum: '2024-12-01',
    erstelltVon: 'Manager',
    bestaetigt: false,
  },
  {
    id: 5,
    kennzeichen: 'MUC-GF 9012',
    kmStand: 44200,
    uebergebenVon: 'Hans Bauer',
    uebergebenZu: 'Depot',
    vonStation: 'MUC1-Garching',
    anStation: 'MUC1-Garching',
    datum: '2024-12-02',
    erstelltVon: 'Admin',
    bestaetigt: false,
  },
]

export const mockWorkshopOrders: WorkshopOrder[] = [
  {
    id: 1,
    kennzeichen: 'B-ER 5720',
    station: 'DHH1-Hamburg',
    eingebracht: '2024-11-20',
    abgeholt: null,
    verweildauer: '13 Tage',
    bemerkung: 'Ölwechsel + Bremseninspektion',
    schaeden: 'Riss in Bremsleitung hinten links',
    status: 'In Bearbeitung' as unknown as WorkshopOrder['status'],
    erstelltVon: 'Dispatcher',
  },
  {
    id: 2,
    kennzeichen: 'HH-GF 1234',
    station: 'DHH1-Hamburg',
    eingebracht: '2024-11-15',
    abgeholt: '2024-11-22',
    verweildauer: '7 Tage',
    bemerkung: 'HU/AU fällig',
    schaeden: '',
    status: 'Abgeschlossen',
    erstelltVon: 'Admin',
  },
  {
    id: 3,
    kennzeichen: 'HB-GF 5678',
    station: 'DHB1-Bremen',
    eingebracht: '2024-12-01',
    abgeholt: null,
    verweildauer: '2 Tage',
    bemerkung: 'Reifenwechsel Winterreifen',
    schaeden: '',
    status: 'Neu',
    erstelltVon: 'Fahrer',
  },
]

export const mockAccidents: Accident[] = [
  {
    id: 1,
    datum: '2024-11-05',
    kennzeichen: 'B-ER 5721',
    station: 'DHH1-Hamburg',
    personalnummer: 'P-10023',
    fahrer: 'Fatima Özdemir',
    abgearbeitet: false,
    bearbeitungsstatus: 'In Bearbeitung',
    sachbearbeiter: 'Maria Schmidt',
    schuldart: 'Fremdverschulden',
    beschreibung: 'Auffahrunfall an der Kreuzung Hammer Str./Wandsbeker Chaussee',
  },
  {
    id: 2,
    datum: '2024-10-22',
    kennzeichen: 'HH-GF 1234',
    station: 'DHH1-Hamburg',
    personalnummer: 'P-10045',
    fahrer: 'Klaus Müller',
    abgearbeitet: true,
    bearbeitungsstatus: 'Abgearbeitet',
    sachbearbeiter: 'Thomas Weber',
    schuldart: 'Eigenverschulden',
    beschreibung: 'Parkschaden beim Rückwärtsfahren',
  },
  {
    id: 3,
    datum: '2024-10-10',
    kennzeichen: 'MUC-GF 9012',
    station: 'MUC1-Garching',
    personalnummer: 'P-20011',
    fahrer: 'Hans Bauer',
    abgearbeitet: true,
    bearbeitungsstatus: 'Abgearbeitet',
    sachbearbeiter: 'Anna Meyer',
    schuldart: 'Fremdverschulden',
    beschreibung: 'Seitenspiegel abgefahren durch vorbeifahrendes Fahrzeug',
  },
  {
    id: 4,
    datum: '2024-09-18',
    kennzeichen: 'HH-GLS 3344',
    station: 'GLS25-Hamburg',
    personalnummer: 'P-30007',
    fahrer: 'Sergei Petrov',
    abgearbeitet: false,
    bearbeitungsstatus: 'nicht abgearbeitet',
    sachbearbeiter: '',
    schuldart: 'Ungeklärt',
    beschreibung: 'Delle in der Seitentür, Verursacher unbekannt',
  },
  {
    id: 5,
    datum: '2024-08-30',
    kennzeichen: 'DBW-GF 6677',
    station: 'DBW8-Messkirchen',
    personalnummer: 'P-40002',
    fahrer: 'Mehmet Yilmaz',
    abgearbeitet: true,
    bearbeitungsstatus: 'Abgearbeitet',
    sachbearbeiter: 'Julia Fischer',
    schuldart: 'Fremdverschulden',
    beschreibung: 'Wildunfall auf der B33',
  },
]

export const mockOffenses: Offense[] = [
  {
    id: 1,
    datum: '2024-11-15',
    kennzeichen: 'B-ER 5721',
    personalnummer: 'P-10023',
    fahrer: 'Fatima Özdemir',
    verstoss: 'Geschwindigkeitsüberschreitung 21 km/h',
    bussgeld: 70,
    aktenzeichen: 'HH-2024-88432',
    bestaetigt: true,
    behoerde: 'Bußgeldbehörde Hamburg',
  },
  {
    id: 2,
    datum: '2024-10-28',
    kennzeichen: 'HH-GF 1234',
    personalnummer: 'P-10045',
    fahrer: 'Klaus Müller',
    verstoss: 'Halteverbot',
    bussgeld: 25,
    aktenzeichen: 'HH-2024-77321',
    bestaetigt: false,
    behoerde: 'Bußgeldbehörde Hamburg',
  },
  {
    id: 3,
    datum: '2024-10-05',
    kennzeichen: 'MUC-GF 9012',
    personalnummer: 'P-20011',
    fahrer: 'Hans Bauer',
    verstoss: 'Rotlichtverstoß',
    bussgeld: 200,
    aktenzeichen: 'MUC-2024-55123',
    bestaetigt: true,
    behoerde: 'Bußgeldbehörde München',
  },
  {
    id: 4,
    datum: '2024-09-12',
    kennzeichen: 'HH-GLS 3344',
    personalnummer: 'P-30007',
    fahrer: 'Sergei Petrov',
    verstoss: 'Handynutzung am Steuer',
    bussgeld: 100,
    aktenzeichen: 'HH-2024-44891',
    bestaetigt: false,
    behoerde: 'Bußgeldbehörde Hamburg',
  },
  {
    id: 5,
    datum: '2024-08-20',
    kennzeichen: 'DBW-GF 6677',
    personalnummer: 'P-40002',
    fahrer: 'Mehmet Yilmaz',
    verstoss: 'Überladung (120 kg)',
    bussgeld: 150,
    aktenzeichen: 'TBB-2024-33211',
    bestaetigt: true,
    behoerde: 'Ordnungsamt Tauberbischofsheim',
  },
]

export const mockTours: Tour[] = [
  {
    id: 1,
    tourId: 'TID-20241204-001',
    tourNr: '1',
    standort: 'DHH1-Hamburg',
    pid: 'P-10045',
    fahrer: 'Klaus Müller',
    kennzeichen: 'HH-GF 1234',
    retouren: 3,
    infos: '',
    datum: '2024-12-04',
    tourType: 'Normal',
  },
  {
    id: 2,
    tourId: 'TID-20241204-002',
    tourNr: '2',
    standort: 'DHH1-Hamburg',
    pid: 'P-10023',
    fahrer: 'Fatima Özdemir',
    kennzeichen: 'B-ER 5721',
    retouren: 7,
    infos: '2x Retoure beschädigt',
    datum: '2024-12-04',
    tourType: 'Normal',
  },
  {
    id: 3,
    tourId: 'TID-20241204-003',
    tourNr: '3',
    standort: 'DHH1-Hamburg',
    pid: 'P-10067',
    fahrer: 'Ahmed Khalil',
    kennzeichen: 'HH-GF 5555',
    retouren: 1,
    infos: '',
    datum: '2024-12-04',
    tourType: 'Normal',
  },
  {
    id: 4,
    tourId: 'TID-20241204-004',
    tourNr: 'E1',
    standort: 'DHH1-Hamburg',
    pid: 'P-10089',
    fahrer: 'Javier García',
    kennzeichen: 'HH-GF 1234',
    retouren: 0,
    infos: 'Notfall-Lieferung',
    datum: '2024-12-04',
    tourType: 'Extra',
  },
  {
    id: 5,
    tourId: 'TID-20241204-005',
    tourNr: '4',
    standort: 'DHH1-Hamburg',
    pid: 'P-10102',
    fahrer: 'Anastasia Voronova',
    kennzeichen: 'B-ER 5721',
    retouren: 5,
    infos: '',
    datum: '2024-12-04',
    tourType: 'Normal',
  },
  {
    id: 6,
    tourId: 'TID-20241203-001',
    tourNr: '1',
    standort: 'DHH1-Hamburg',
    pid: 'P-10045',
    fahrer: 'Klaus Müller',
    kennzeichen: 'HH-GF 1234',
    retouren: 2,
    infos: '',
    datum: '2024-12-03',
    tourType: 'Normal',
  },
  {
    id: 7,
    tourId: 'TID-20241203-002',
    tourNr: '2',
    standort: 'DHH1-Hamburg',
    pid: 'P-10023',
    fahrer: 'Fatima Özdemir',
    kennzeichen: 'B-ER 5721',
    retouren: 4,
    infos: '',
    datum: '2024-12-03',
    tourType: 'Normal',
  },
  {
    id: 8,
    tourId: 'TID-20241202-001',
    tourNr: '1',
    standort: 'DHH1-Hamburg',
    pid: 'P-10045',
    fahrer: 'Klaus Müller',
    kennzeichen: 'HH-GF 1234',
    retouren: 6,
    infos: 'Fahrzeug hatte Panne, verzögerte Rückkehr',
    datum: '2024-12-02',
    tourType: 'Normal',
  },
  {
    id: 9,
    tourId: 'TID-20241202-002',
    tourNr: 'R1',
    standort: 'DHH1-Hamburg',
    pid: 'P-10067',
    fahrer: 'Ahmed Khalil',
    kennzeichen: 'HH-GF 5555',
    retouren: 0,
    infos: 'Rescue für Tour 3',
    datum: '2024-12-02',
    tourType: 'Rescue',
  },
  {
    id: 10,
    tourId: 'TID-20241201-001',
    tourNr: '1',
    standort: 'DHH1-Hamburg',
    pid: 'P-10045',
    fahrer: 'Klaus Müller',
    kennzeichen: 'HH-GF 1234',
    retouren: 3,
    infos: '',
    datum: '2024-12-01',
    tourType: 'Normal',
  },
]

export const mockAgeingtours: Tour[] = [
  {
    id: 101,
    tourId: 'TID-AGE-001',
    tourNr: '2',
    standort: 'DHH1-Hamburg',
    pid: 'P-10023',
    fahrer: 'Fatima Özdemir',
    kennzeichen: 'B-ER 5721',
    retouren: 12,
    infos: 'Pakete älter als 3 Tage',
    datum: '2024-12-01',
    tourType: 'Normal',
  },
  {
    id: 102,
    tourId: 'TID-AGE-002',
    tourNr: '5',
    standort: 'DHH1-Hamburg',
    pid: 'P-10102',
    fahrer: 'Anastasia Voronova',
    kennzeichen: 'B-ER 5721',
    retouren: 8,
    infos: '3 Pakete älter als 5 Tage',
    datum: '2024-11-29',
    tourType: 'Normal',
  },
  {
    id: 103,
    tourId: 'TID-AGE-003',
    tourNr: '1',
    standort: 'DHH1-Hamburg',
    pid: 'P-10045',
    fahrer: 'Klaus Müller',
    kennzeichen: 'HH-GF 1234',
    retouren: 15,
    infos: 'Kritischer Ageing-Bestand',
    datum: '2024-11-28',
    tourType: 'Normal',
  },
  {
    id: 104,
    tourId: 'TID-AGE-004',
    tourNr: '3',
    standort: 'DHH1-Hamburg',
    pid: 'P-10067',
    fahrer: 'Ahmed Khalil',
    kennzeichen: 'HH-GF 5555',
    retouren: 6,
    infos: '',
    datum: '2024-11-25',
    tourType: 'Extra',
  },
  {
    id: 105,
    tourId: 'TID-AGE-005',
    tourNr: '2',
    standort: 'DHH1-Hamburg',
    pid: 'P-10023',
    fahrer: 'Fatima Özdemir',
    kennzeichen: 'B-ER 5721',
    retouren: 9,
    infos: '',
    datum: '2024-11-22',
    tourType: 'Normal',
  },
]

export const mockInventory: InventoryItem[] = mockVehicles.map((v) => ({
  id: v.id,
  kennzeichen: v.kennzeichen,
  fin: v.fin,
  standort: v.standort,
  inventurTyp: v.inventartyp,
  status: v.status,
  inventurFertig: v.status !== 'Werkstatt' && v.status !== 'abgemeldet',
  letztesInventurdatum: '2024-11-01',
}))

export const fleetStatusSummary = {
  imEinsatz: 168,
  puffer: 94,
  werkstatt: 8,
  abgemeldet: 12,
  zurueckgegeben: 5,
  verkauft: 3,
}

export const tourStatsByMonth = [
  { monat: 'Jul 24', dhh1: 312, dhb1: 180, dbw8: 145, dsh4: 98, muc1: 220, gls: 175, dpd: 130 },
  { monat: 'Aug 24', dhh1: 328, dhb1: 192, dbw8: 152, dsh4: 105, muc1: 235, gls: 182, dpd: 138 },
  { monat: 'Sep 24', dhh1: 305, dhb1: 175, dbw8: 140, dsh4: 95, muc1: 210, gls: 168, dpd: 125 },
  { monat: 'Okt 24', dhh1: 340, dhb1: 200, dbw8: 162, dsh4: 112, muc1: 248, gls: 195, dpd: 145 },
  { monat: 'Nov 24', dhh1: 295, dhb1: 168, dbw8: 135, dsh4: 88, muc1: 195, gls: 155, dpd: 118 },
  { monat: 'Dez 24', dhh1: 180, dhb1: 95, dbw8: 78, dsh4: 52, muc1: 115, gls: 92, dpd: 68 },
]
