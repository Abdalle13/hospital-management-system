import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/userModel.js';
import Patient from './models/patientModel.js';
import Doctor from './models/doctorModel.js';
import Appointment from './models/appointmentModel.js';
import AppointmentRequest from './models/appointmentRequestModel.js';
import Invoice from './models/invoiceModel.js';
import Medicine from './models/medicineModel.js';
import Record from './models/recordModel.js';
import Settings from './models/settingsModel.js';

dotenv.config();

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
};

const destroyData = async () => {
  await Promise.all([
    User.deleteMany(),
    Patient.deleteMany(),
    Doctor.deleteMany(),
    Appointment.deleteMany(),
    AppointmentRequest.deleteMany(),
    Invoice.deleteMany(),
    Medicine.deleteMany(),
    Record.deleteMany(),
    Settings.deleteMany(),
  ]);
  console.log('🗑️  All collections cleared');
};

const seedData = async () => {
  // --- Users ---
  const admin = await User.create({
    name: 'Amina Warsame', email: 'admin@gmail.com', password: 'password123',
    phone: '+252611000001', role: 'admin',
  });
  const receptionist = await User.create({
    name: 'Hodan Ali', email: 'reception@gmail.com', password: 'password123',
    phone: '+252611000002', role: 'receptionist',
  });
  const doctorUser1 = await User.create({
    name: 'Dr. Yusuf Hassan', email: 'dr.yusuf@gmail.com', password: 'password123',
    phone: '+252611000003', role: 'doctor',
  });
  const doctorUser2 = await User.create({
    name: 'Dr. Faduma Nur', email: 'dr.faduma@gmail.com', password: 'password123',
    phone: '+252611000004', role: 'doctor',
  });
  const patientUser1 = await User.create({
    name: 'Abdirahman Jama', email: 'patient@gmail.com', password: 'password123',
    phone: '+252611000005', role: 'patient',
  });
  const patientUser2 = await User.create({
    name: 'Sahra Mohamed', email: 'sahra@gmail.com', password: 'password123',
    phone: '+252611000006', role: 'patient',
  });
  console.log('👤 Users created');

  // --- Doctors ---
  const doctor1 = await Doctor.create({
    name: 'Yusuf Hassan', specialization: 'Cardiology', phone: doctorUser1.phone,
    email: doctorUser1.email, bio: 'Senior cardiologist with 12 years of experience.',
    schedule: { days: ['Monday', 'Wednesday', 'Friday'], startTime: '09:00', endTime: '17:00' },
    consultationFee: 40, userId: doctorUser1._id,
  });
  const doctor2 = await Doctor.create({
    name: 'Faduma Nur', specialization: 'Pediatrics', phone: doctorUser2.phone,
    email: doctorUser2.email, bio: 'Pediatrician focused on childhood development and vaccination.',
    schedule: { days: ['Sunday', 'Tuesday', 'Thursday'], startTime: '10:00', endTime: '18:00' },
    consultationFee: 30, userId: doctorUser2._id,
  });
  const doctor3 = await Doctor.create({
    name: 'Khalid Omar', specialization: 'General Medicine', phone: '+252611000007',
    email: 'dr.khalid@gmail.com', bio: 'General practitioner and family medicine.',
    schedule: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], startTime: '08:00', endTime: '16:00' },
    consultationFee: 20,
  });
  console.log('🩺 Doctors created');

  // --- Patients (two linked to user logins, two walk-ins registered by staff) ---
  const patient1 = await Patient.create({
    name: patientUser1.name, age: 34, gender: 'Male', bloodType: 'O+',
    phone: patientUser1.phone, email: patientUser1.email, address: 'Hodan District, Mogadishu',
    emergencyContact: { name: 'Fartun Jama', phone: '+252611000010', relationship: 'Sister' },
    allergies: ['Penicillin'], registeredBy: receptionist._id, userId: patientUser1._id,
  });
  const patient2 = await Patient.create({
    name: patientUser2.name, age: 27, gender: 'Female', bloodType: 'A+',
    phone: patientUser2.phone, email: patientUser2.email, address: 'Wadajir District, Mogadishu',
    emergencyContact: { name: 'Mohamed Ali', phone: '+252611000011', relationship: 'Father' },
    allergies: [], registeredBy: receptionist._id, userId: patientUser2._id,
  });
  const patient3 = await Patient.create({
    name: 'Cabdulle Nur', age: 45, gender: 'Male', bloodType: 'B+',
    phone: '+252611000008', address: 'Karan District, Mogadishu',
    emergencyContact: { name: 'Ayaan Nur', phone: '+252611000012', relationship: 'Wife' },
    allergies: ['Sulfa drugs'], notes: 'Hypertensive, on regular checkups.', registeredBy: receptionist._id,
  });
  const patient4 = await Patient.create({
    name: 'Ifrah Salad', age: 8, gender: 'Female', bloodType: 'Unknown',
    phone: '+252611000009', address: 'Bondhere District, Mogadishu',
    emergencyContact: { name: 'Salad Warsame', phone: '+252611000013', relationship: 'Father' },
    registeredBy: receptionist._id,
  });
  console.log('🧑‍🤝‍🧑 Patients created');

  // --- Appointments ---
  const pastAppt1 = await Appointment.create({
    patient: patient1._id, doctor: doctor1._id, date: daysFromNow(-10), time: '10:00',
    reason: 'Chest pain evaluation', status: 'Completed', bookedBy: receptionist._id,
  });
  const pastAppt2 = await Appointment.create({
    patient: patient3._id, doctor: doctor3._id, date: daysFromNow(-5), time: '09:30',
    reason: 'Routine blood pressure checkup', status: 'Completed', bookedBy: receptionist._id,
  });
  const todayAppt = await Appointment.create({
    patient: patient4._id, doctor: doctor2._id, date: daysFromNow(0), time: '11:00',
    reason: 'Vaccination follow-up', status: 'Scheduled', bookedBy: receptionist._id,
  });
  const upcomingAppt = await Appointment.create({
    patient: patient2._id, doctor: doctor1._id, date: daysFromNow(3), time: '14:00',
    reason: 'Follow-up consultation', status: 'Scheduled', bookedBy: receptionist._id,
  });
  await Appointment.create({
    patient: patient2._id, doctor: doctor3._id, date: daysFromNow(-2), time: '13:00',
    reason: 'General checkup', status: 'Cancelled', bookedBy: receptionist._id,
  });
  console.log('📅 Appointments created');

  // --- Appointment Requests (public, not yet confirmed) ---
  await AppointmentRequest.create({
    name: 'Nasteexo Warsame', phone: '+252611000020', department: 'Cardiology',
    date: daysFromNow(5), time: '10:30', message: 'Occasional chest tightness.', status: 'Pending',
  });
  await AppointmentRequest.create({
    name: 'Xasan Cabdi', phone: '+252611000021', department: 'General Medicine',
    date: daysFromNow(6), time: '09:00', message: 'Persistent cough for a week.', status: 'Pending',
  });
  console.log('📝 Appointment requests created');

  // --- Medical Records ---
  await Record.create({
    patient: patient1._id, doctor: doctor1._id, appointment: pastAppt1._id,
    diagnosis: 'Mild angina, no acute coronary event',
    prescription: [{ medication: 'Aspirin', dosage: '75mg', duration: '30 days' }],
    notes: 'Advised lifestyle changes and follow-up in 4 weeks.',
    followUpDate: daysFromNow(20),
    vitalSigns: { bloodPressure: '130/85', heartRate: '78 bpm', temperature: '36.8°C', weight: '82kg' },
  });
  await Record.create({
    patient: patient3._id, doctor: doctor3._id, appointment: pastAppt2._id,
    diagnosis: 'Stage 1 Hypertension',
    prescription: [{ medication: 'Amlodipine', dosage: '5mg', duration: '90 days' }],
    notes: 'Recommended low-sodium diet and regular exercise.',
    followUpDate: daysFromNow(30),
    vitalSigns: { bloodPressure: '145/92', heartRate: '82 bpm', temperature: '36.6°C', weight: '90kg' },
  });
  console.log('📋 Medical records created');

  // --- Invoices ---
  await Invoice.create({
    patient: patient1._id, doctor: doctor1._id, appointment: pastAppt1._id,
    services: [{ name: 'Consultation', amount: 40 }, { name: 'ECG', amount: 25 }],
    totalAmount: 65, paidAmount: 65, paymentStatus: 'Paid', paymentMethod: 'EVC Plus', paidAt: daysFromNow(-10),
  });
  await Invoice.create({
    patient: patient3._id, doctor: doctor3._id, appointment: pastAppt2._id,
    services: [{ name: 'Consultation', amount: 20 }, { name: 'Blood Panel', amount: 15 }],
    totalAmount: 35, paidAmount: 20, paymentStatus: 'Partial', paymentMethod: 'Cash', paidAt: daysFromNow(-5),
  });
  await Invoice.create({
    patient: patient2._id, doctor: doctor1._id, appointment: upcomingAppt._id,
    services: [{ name: 'Consultation', amount: 40 }],
    totalAmount: 40, paidAmount: 0, paymentStatus: 'Unpaid', paymentMethod: '',
  });
  console.log('🧾 Invoices created');

  // --- Pharmacy / Medicine inventory ---
  await Medicine.create([
    { name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 120, lowStockThreshold: 30, expiryDate: daysFromNow(365), price: 0.5, manufacturer: 'Cipla' },
    { name: 'Paracetamol 500mg', category: 'Analgesic', stock: 8, lowStockThreshold: 20, expiryDate: daysFromNow(400), price: 0.2, manufacturer: 'GSK' },
    { name: 'Amlodipine 5mg', category: 'Antihypertensive', stock: 60, lowStockThreshold: 15, expiryDate: daysFromNow(500), price: 0.8, manufacturer: 'Pfizer' },
    { name: 'Aspirin 75mg', category: 'Antiplatelet', stock: 5, lowStockThreshold: 25, expiryDate: daysFromNow(300), price: 0.3, manufacturer: 'Bayer' },
    { name: 'Oral Rehydration Salts', category: 'Supplement', stock: 200, lowStockThreshold: 50, expiryDate: daysFromNow(600), price: 0.4, manufacturer: 'WHO Supply' },
    { name: 'Ibuprofen 400mg', category: 'Analgesic', stock: 45, lowStockThreshold: 20, expiryDate: daysFromNow(250), price: 0.35, manufacturer: 'Cipla' },
  ]);
  console.log('💊 Pharmacy inventory created');

  // --- Settings ---
  await Settings.create({
    hospitalName: 'SmartClinic', address: 'Airport Road, Mogadishu, Somalia',
    phone: '+252611000000', email: 'info@smartclinic.com', website: 'https://smartclinic.example.com',
    workingHours: { start: '08:00', end: '20:00' },
    workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    currency: 'USD', taxRate: 0,
  });
  console.log('⚙️  Settings created');

  console.log('\n✅ Seed complete. Login with:');
  console.log('   Admin:        admin@gmail.com / password123');
  console.log('   Receptionist: reception@gmail.com / password123');
  console.log('   Doctor:       dr.yusuf@gmail.com / password123');
  console.log('   Patient:      patient@gmail.com / password123');
};

const run = async () => {
  await connectDB();
  try {
    if (process.argv.includes('-d') || process.argv.includes('--destroy')) {
      await destroyData();
    } else {
      await destroyData();
      await seedData();
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

run();
