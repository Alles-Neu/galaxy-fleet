import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Vehicle Statuses
  const statusNames = [
    { name: 'Puffer', sort_order: 1 },
    { name: 'Werkstatt', sort_order: 2 },
    { name: 'Servicefahrzeug', sort_order: 3 },
    { name: 'im Einsatz', sort_order: 4 },
    { name: 'SUB (im Einsatz)', sort_order: 5 },
    { name: 'abgemeldet', sort_order: 6 },
    { name: 'zurückgegeben', sort_order: 7 },
    { name: 'verkauft', sort_order: 8 },
    { name: 'Dispo Fahrzeug', sort_order: 9 },
    { name: 'vermietet an SUB', sort_order: 10 },
    { name: 'Inseriert und abgemeldet', sort_order: 11 },
    { name: 'vermietet an', sort_order: 12 },
    { name: 'Fahrzeugaufbereitung', sort_order: 13 },
    { name: 'Geschäftsführerfahrzeug', sort_order: 14 },
    { name: 'Verwaltungsfahrzeug', sort_order: 15 },
    { name: 'Warten auf Reparatur', sort_order: 16 },
    { name: 'Benötigt Abschlepper', sort_order: 17 },
    { name: 'zum Verkauf', sort_order: 18 },
  ];

  for (const s of statusNames) {
    await prisma.vehicleStatus.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }
  console.log('Vehicle statuses seeded');

  // Vehicle Brands & Models
  const brandsData = [
    { name: 'BMW', models: [] },
    { name: 'Citroën', models: [] },
    { name: 'Iveco', models: ['Magirus'] },
    { name: 'Mercedes Benz', models: ['Actros'] },
    { name: 'nicht definiert', models: [] },
    { name: 'Opel', models: [] },
    { name: 'Peugeot', models: [] },
    { name: 'Volkswagen', models: ['VW TRANSPORTER T6 Kastenwagen'] },
  ];

  for (const b of brandsData) {
    const brand = await prisma.vehicleBrand.upsert({
      where: { name: b.name },
      update: {},
      create: { name: b.name },
    });
    for (const modelName of b.models) {
      const existing = await prisma.vehicleModel.findFirst({
        where: { name: modelName, brand_id: brand.id },
      });
      if (!existing) {
        await prisma.vehicleModel.create({
          data: { name: modelName, brand_id: brand.id },
        });
      }
    }
  }
  console.log('Brands and models seeded');

  // Procurement Types
  const procurementTypes = [
    'nicht definiert',
    'Leasing',
    'Finanzierung',
    'Miete',
    'keine Angaben',
  ];
  for (const name of procurementTypes) {
    await prisma.procurementType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Procurement types seeded');

  // Document Types
  const documentTypes = [
    'Ablöseunterlagen',
    'Abmeldebestätigung',
    'Abrechnungsschreiben Versicherung',
    'AU - Protokoll',
    'Ausfuhrerklärung',
    'Auslieferungsbestätigung',
    'Banküberweisung - Zahlungseingang (Fahrzeugverkauf)',
    'Bestellung',
    'BO-Kraft Bescheinigung',
    'CoC-Dokument',
    'Darlehensantrag',
    'EG - Übereinstimmungsbescheinigung',
    'Einzahlungsbeleg',
    'Empfangsbestätigung',
    'EU - Lizenz',
    'EU-Kontrollgerät Aufkleber',
    'EU-Prüfung Kühlsystem',
    'EU-Prüfung Temperaturfühler',
    'Euromaster Arbeitsnachweis',
    'Fahrzeugbrief',
    'Fahrzeugdaten',
    'Fahrzeugschein',
    'Feinstaubplakette',
    'Feuerlöscher',
    'Finanzierungsvertrag',
    'Firmenunterlagen vom Kunden (Fahrzeugverkauf)',
    'Garantieauftrag',
    'Garantievereinbarung',
    'Gelangensbestätigung',
    'Genehmigungsurkunde',
    'Grüne Karte',
    'Gutachten',
    'HU',
    'Inspektionsnachweis',
    'Kaufvertrag',
    'Kautionserstattung',
    'Kennzeichen mit HU-Plakette',
    'KFZ-AUDIT Intern',
    'Kfz-Steuer',
    'Konformitätserklärung',
    'Kostenvoranschlag (KVA)',
    'Kühlaggregat Prüfung',
    'Lärmarmes Kraftfahrzeugdokument',
    'Leasing - Bestätigung',
    'Leasing Rückgabeprotokoll',
    'Leasingsonderzahlung',
    'Leasingübernahmevertrag',
    'Leasingvertrag',
    'Mahnung Sixt GmbH & Co.',
    'Mars Werkstatt Protokoll',
    'Mars Werkstatt Reparatur Protokoll',
    'Mastercheck Euromaster',
    'Mautbefreiung Bestätigung',
    'Messprotokoll Eichamt',
    'Mietvertrag',
    'nicht definiert',
    'Rechnung',
    'Rechnung Fahrzeugverkauf',
    'Rechnung Reparatur',
    'Registrierung Mautbefreiung',
    'Rückgabeprotokoll',
    'Rückgabeprotokoll Buchbinder - Europcar',
    'Rückgabeprotokoll Hertz',
    'Rückgabeprotokoll MAN',
    'Rückgabeprotokoll Mercedes',
    'Rückgabeprotokoll SixT',
    'Rückrufaktion',
    'Schadenanzeige',
    'Schadenersatzanspruch SixT',
    'Schadensbericht Hertz',
    'Servicekarte',
    'Servicevertrag',
    'SP - Prüfplakette',
    'Tacho - Prüfung § 57b',
    'TÜV',
    'Übergabeprotokoll',
    'Übergabeprotokoll Mercedes',
    'USt-IdNr. Überprüfung',
    'UVV Plus Prüfung',
    'UVV Prüfung',
    'Verbandskasten',
    'Verkehrsverstoß',
    'Versicherungs-Karte Daimler AG',
    'Versicherungskarte',
    'Versicherungsschein',
    'Vertragsübernahme',
    'Wartungsliste',
    'Wartungsvertrag',
    'Zins- und Tilgungsplan',
  ];
  for (const name of documentTypes) {
    await prisma.documentType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Document types seeded');

  // Insurance Companies
  const insuranceCompanies = [
    'nicht definiert',
    'Verti Versicherung AG',
    'SG IFFOXX Assekuranzmaklergesellschaft mbH',
    'Hector Digital',
    'Kravag Versicherung',
  ];
  for (const name of insuranceCompanies) {
    await prisma.insuranceCompany.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Insurance companies seeded');

  // Offense Types
  const offenseTypes = [
    'Geschwindigkeitsverstoß',
    'Abstandsverstoß',
    'Überholverstoß',
    'Rotlichtverstoß',
    'Handyverstoß',
    'Parkverstoß',
    'Mautverstoß',
    'Verstoß gegen Vorschriftszeichen',
    'Anhörungsbogen',
  ];
  for (const name of offenseTypes) {
    await prisma.offenseType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Offense types seeded');

  // Fault Types
  const faultTypes = [
    'Nicht definiert',
    'Fremdschaden (verschuldet)',
    'Fremd und Eigenschaden (verschuldet)',
    'Eigenschaden (unverschuldet)',
    'Eigenschaden (verschuldet)',
    'Schuldfrage strittig',
  ];
  for (const name of faultTypes) {
    await prisma.faultType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Fault types seeded');

  // Accident Processing Statuses
  const accidentProcessingStatuses = [
    'Warten auf Schadensmeldung von Unfallgegner',
    'Warten auf Rückmeldung unserer Versicherung',
    'Warten auf Rückmeldung gegnerische Versicherung',
    'Warten auf Rückmeldung Rechtsanwalt',
    'Warten auf Rückmeldung Gutachter',
    'Warten auf Entschädigung',
    'Warten auf Rückmeldung Disponenten',
    'Warten auf Rückmeldung Mietgesellschaft',
  ];
  for (const name of accidentProcessingStatuses) {
    await prisma.accidentProcessingStatus.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Accident processing statuses seeded');

  // Absence Types
  const absenceTypes = [
    'Krankheit mit AU',
    'Krankheit ohne AU',
    'Kind krank',
    'fehlt unentschuldigt',
  ];
  for (const name of absenceTypes) {
    await prisma.absenceType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Absence types seeded');

  // Companies
  const companies = [
    { name: 'EuRide GmbH', address: 'Berlin, Deutschland' },
    { name: 'Spedition Almaz GmbH', address: 'Berlin, Deutschland' },
    { name: 'Everest Transport GmbH', address: 'Berlin, Deutschland' },
  ];
  const createdCompanies: Record<string, any> = {};
  for (const c of companies) {
    const company = await prisma.company.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
    createdCompanies[c.name] = company;
  }
  console.log('Companies seeded');

  // Stations
  const stationsData = [
    { code: 'BER1', full_name: 'Berlin Mitte Depot', address: 'Müllerstraße 1, 13353 Berlin', type: 'depot', client: 'AMZL', company: 'EuRide GmbH' },
    { code: 'BER2', full_name: 'Berlin Spandau Depot', address: 'Spandauer Damm 100, 14059 Berlin', type: 'depot', client: 'AMZL', company: 'EuRide GmbH' },
    { code: 'BER3', full_name: 'Berlin Reinickendorf', address: 'Scharnweberstraße 21, 13405 Berlin', type: 'depot', client: 'AMZL', company: 'EuRide GmbH' },
    { code: 'BER4', full_name: 'Berlin Lichtenberg', address: 'Herzbergstraße 55, 10365 Berlin', type: 'depot', client: 'AMZL', company: 'EuRide GmbH' },
    { code: 'BER5', full_name: 'Berlin Tempelhof', address: 'Columbiadamm 10, 10965 Berlin', type: 'depot', client: 'AMZL', company: 'EuRide GmbH' },
    { code: 'BER6', full_name: 'Berlin Köpenick', address: 'Wendenschloßstraße 300, 12557 Berlin', type: 'depot', client: 'AMZL', company: 'EuRide GmbH' },
    { code: 'BER7', full_name: 'Berlin Neukölln', address: 'Britzer Damm 42, 12347 Berlin', type: 'depot', client: 'AMZL', company: 'EuRide GmbH' },
    { code: 'BER8', full_name: 'Berlin Charlottenburg', address: 'Kaiserdamm 22, 14057 Berlin', type: 'depot', client: 'GLS', company: 'Spedition Almaz GmbH' },
    { code: 'BER9', full_name: 'Berlin Marzahn', address: 'Landsberger Allee 400, 12681 Berlin', type: 'depot', client: 'GLS', company: 'Spedition Almaz GmbH' },
    { code: 'BER10', full_name: 'Berlin Steglitz', address: 'Lankwitzer Straße 47, 12107 Berlin', type: 'depot', client: 'GLS', company: 'Spedition Almaz GmbH' },
    { code: 'HAM1', full_name: 'Hamburg Nordwest Depot', address: 'Schnackenburgallee 20, 22525 Hamburg', type: 'depot', client: 'AMZL', company: 'EuRide GmbH' },
    { code: 'HAM2', full_name: 'Hamburg Süd Depot', address: 'Hannoversche Straße 60, 21079 Hamburg', type: 'depot', client: 'AMZL', company: 'EuRide GmbH' },
    { code: 'MUC1', full_name: 'München Ost Depot', address: 'Anzinger Straße 45, 81671 München', type: 'depot', client: 'AMZL', company: 'EuRide GmbH' },
    { code: 'MUC2', full_name: 'München West Depot', address: 'Landsberger Straße 300, 80687 München', type: 'depot', client: 'DPD', company: 'Everest Transport GmbH' },
    { code: 'WKS1', full_name: 'Hauptwerkstatt Berlin', address: 'Gewerbepark 1, 13088 Berlin', type: 'workshop', client: 'internal', company: 'EuRide GmbH' },
    { code: 'WKS2', full_name: 'Werkstatt Hamburg', address: 'Industriestraße 5, 21073 Hamburg', type: 'workshop', client: 'internal', company: 'EuRide GmbH' },
    { code: 'HQ1', full_name: 'Hauptverwaltung Berlin', address: 'Friedrichstraße 100, 10117 Berlin', type: 'hq', client: 'internal', company: 'EuRide GmbH' },
    { code: 'RENT1', full_name: 'Mietstation Berlin', address: 'Alexanderplatz 1, 10178 Berlin', type: 'rental', client: 'internal', company: 'EuRide GmbH' },
    { code: 'EVR1', full_name: 'Everest Berlin Mitte', address: 'Seestraße 21, 13353 Berlin', type: 'depot', client: 'AMZL', company: 'Everest Transport GmbH' },
    { code: 'EVR2', full_name: 'Everest Berlin Nord', address: 'Residenzstraße 60, 13409 Berlin', type: 'depot', client: 'AMZL', company: 'Everest Transport GmbH' },
    { code: 'ALM1', full_name: 'Almaz Logistik Zentrum', address: 'Gewerbestraße 12, 12099 Berlin', type: 'depot', client: 'GLS', company: 'Spedition Almaz GmbH' },
    { code: 'VRT1', full_name: 'Virtuelles Lager', address: null, type: 'virtual', client: 'internal', company: 'EuRide GmbH' },
    { code: 'STR1', full_name: 'Stuttgart Depot', address: 'Pragstraße 100, 70376 Stuttgart', type: 'depot', client: 'DPD', company: 'Everest Transport GmbH' },
    { code: 'KOL1', full_name: 'Köln Depot', address: 'Oskar-Jäger-Straße 50, 50825 Köln', type: 'depot', client: 'AMZL', company: 'EuRide GmbH' },
  ];

  const createdStations: Record<string, any> = {};
  for (const s of stationsData) {
    const company = createdCompanies[s.company];
    const station = await prisma.station.upsert({
      where: { code: s.code },
      update: {},
      create: {
        code: s.code,
        full_name: s.full_name,
        address: s.address,
        type: s.type,
        client: s.client,
        company_id: company?.id,
      },
    });
    createdStations[s.code] = station;
  }
  console.log('Stations seeded');

  // Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password_hash: passwordHash,
      role: 'admin',
      active: true,
    },
  });
  console.log('Admin user seeded');

  // Demo Vehicles
  const imEinsatzStatus = await prisma.vehicleStatus.findFirst({ where: { name: 'im Einsatz' } });
  const pufferStatus = await prisma.vehicleStatus.findFirst({ where: { name: 'Puffer' } });
  const werkstattStatus = await prisma.vehicleStatus.findFirst({ where: { name: 'Werkstatt' } });
  const vwBrand = await prisma.vehicleBrand.findFirst({ where: { name: 'Volkswagen' } });
  const mbBrand = await prisma.vehicleBrand.findFirst({ where: { name: 'Mercedes Benz' } });
  const opelBrand = await prisma.vehicleBrand.findFirst({ where: { name: 'Opel' } });
  const euRide = createdCompanies['EuRide GmbH'];
  const almaz = createdCompanies['Spedition Almaz GmbH'];
  const everest = createdCompanies['Everest Transport GmbH'];
  const ber1 = createdStations['BER1'];
  const ber2 = createdStations['BER2'];
  const ber8 = createdStations['BER8'];

  const demoVehicles = [
    { license_plate: 'B-GF 1001', brand_id: vwBrand!.id, model: 'VW TRANSPORTER T6 Kastenwagen', company_id: euRide.id, station_id: ber1.id, status_id: imEinsatzStatus!.id, km_reading: 45000 },
    { license_plate: 'B-GF 1002', brand_id: vwBrand!.id, model: 'VW TRANSPORTER T6 Kastenwagen', company_id: euRide.id, station_id: ber1.id, status_id: imEinsatzStatus!.id, km_reading: 38000 },
    { license_plate: 'B-GF 1003', brand_id: mbBrand!.id, model: 'Actros', company_id: euRide.id, station_id: ber2.id, status_id: pufferStatus!.id, km_reading: 120000 },
    { license_plate: 'B-GF 1004', brand_id: vwBrand!.id, model: 'VW TRANSPORTER T6 Kastenwagen', company_id: euRide.id, station_id: ber2.id, status_id: werkstattStatus!.id, km_reading: 67000 },
    { license_plate: 'B-GF 1005', brand_id: opelBrand!.id, model: null, company_id: almaz.id, station_id: ber8.id, status_id: imEinsatzStatus!.id, km_reading: 22000 },
    { license_plate: 'B-GF 1006', brand_id: opelBrand!.id, model: null, company_id: almaz.id, station_id: ber8.id, status_id: imEinsatzStatus!.id, km_reading: 19500 },
    { license_plate: 'B-GF 1007', brand_id: vwBrand!.id, model: 'VW TRANSPORTER T6 Kastenwagen', company_id: everest.id, station_id: createdStations['EVR1'].id, status_id: imEinsatzStatus!.id, km_reading: 55000 },
    { license_plate: 'B-GF 1008', brand_id: vwBrand!.id, model: 'VW TRANSPORTER T6 Kastenwagen', company_id: everest.id, station_id: createdStations['EVR1'].id, status_id: pufferStatus!.id, km_reading: 31000 },
    { license_plate: 'B-GF 1009', brand_id: mbBrand!.id, model: null, company_id: euRide.id, station_id: createdStations['BER3'].id, status_id: imEinsatzStatus!.id, km_reading: 88000 },
    { license_plate: 'B-GF 1010', brand_id: vwBrand!.id, model: 'VW TRANSPORTER T6 Kastenwagen', company_id: euRide.id, station_id: createdStations['BER4'].id, status_id: imEinsatzStatus!.id, km_reading: 41000 },
  ];

  for (const v of demoVehicles) {
    const existing = await prisma.vehicle.findUnique({ where: { license_plate: v.license_plate } });
    if (!existing) {
      await prisma.vehicle.create({ data: v });
    }
  }
  console.log('Demo vehicles seeded');

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
