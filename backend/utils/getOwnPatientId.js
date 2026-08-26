import Patient from '../models/patientModel.js';

// Resolves the Patient document id linked to a logged-in user, falling back
// to email for patient records created before the userId link existed.
const getOwnPatientId = async (user) => {
  let patient = await Patient.findOne({ userId: user._id }).select('_id');
  if (!patient) patient = await Patient.findOne({ email: user.email }).select('_id');
  return patient?._id || null;
};

export default getOwnPatientId;
