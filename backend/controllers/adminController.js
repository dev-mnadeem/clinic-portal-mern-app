import Patient from "../models/patientModel.js";
import Doctor from "../models/DoctorModel.js";
import Pharmacy from "../models/PharmacyModel.js";
import Admin from "../models/adminModel.js";
import Appointment from "../models/AppointmentModel.js";
import Lab from "../models/LaboratoryModel.js";
import Report from "../models/reportModel.js";
import bcrypt from "bcrypt";

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error getting patients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllPharmacies = async (req, res) => {
  try {
    const Pharmacies = await Pharmacy.find();
    res.status(200).json(Pharmacies);
  } catch (error) {
    console.error("Error getting Data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllDoctors = async (req, res) => {
  try {
    const Doctors = await Doctor.find();
    res.status(200).json(Doctors);
  } catch (error) {
    console.error("Error getting Data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllLabs = async (req, res) => {
  try {
    const Labs = await Lab.find();
    res.status(200).json(Labs);
  } catch (error) {
    console.error("Error getting Data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addPatient = async (req, res) => {
  try {
    console.log(req.body);

    const { name, email, password, disease, age, phone, address } =
      req.body.data;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const patient = new Patient({
      name: name,
      email: email,
      password: hashedPassword,
      age: age,
      disease: disease,
      phoneNumber: phone,
      address: address,
    });
    await patient.save();
    res
      .status(201)
      .json({ message: "Patient created successfully", user: patient });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addDoctor = async (req, res) => {
  try {
    console.log(req.body.data);

    const { name, email, password, specification, phone, address } =
      req.body.data;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const doctor = new Doctor({
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      specification: specification,
      phoneNumber: phone,
    });
    await doctor.save();
    res.status(201).json({ message: " Doctor created successfully" });
  } catch (error) {
    console.error("Error creating :Doctor", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addPharmacy = async (req, res) => {
  try {
    console.log(req.body);

    const { name, email, password, phone } = req.body.data;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const existingPharmacy = await Pharmacy.findOne({ email });
    if (existingPharmacy) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const newPharmacy = new Pharmacy({
      name: name,
      email: email,
      password: hashedPassword,
      phoneNumber: phone,
    });
    await newPharmacy.save();
    res.status(201).json({ message: " Pharm created successfully" });
  } catch (error) {
    console.error("Error creating :Pharm", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addLab = async (req, res) => {
  try {
    console.log(req.body);

    const { name, email, password, address, phone, specification } =
      req.body.data;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const existingLab = await Lab.findOne({ email });
    if (existingLab) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const newLab = new Lab({
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      specification: specification,
      phoneNumber: phone,
    });
    await newLab.save();
    res.status(201).json({ message: " Lab created successfully" });
  } catch (error) {
    console.error("Error creating :Lab", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const delDoctor = async (req, res) => {
  const userId = req.body.data.userId;

  try {
    const user = await Doctor.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      await Appointment.deleteMany({ doctorId: userId });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
const delPatient = async (req, res) => {
  const userId = req.body.data.userId;

  try {
    const user = await Patient.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      await Appointment.deleteMany({ patientId: userId });
      await Report.deleteMany({ patientId: userId });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
const delPharmacy = async (req, res) => {
  const userId = req.body.data.userId;

  try {
    const user = await Pharmacy.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
const delLab = async (req, res) => {
  const userId = req.body.data.userId;

  try {
    const user = await Lab.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      await Report.deleteMany({ LabId: userId });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
const updatePatient = async (req, res) => {
  try {
    console.log(req.body.data);
    // Find user based on email
    const user = await Patient.findOne({ email: req.body.data.email });

    // If user not found, return an error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if they are present in the request body
    if (req.body.data.name) {
      user.name = req.body.data.name;
    }

    if (req.body.data.password !== undefined) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.data.password, saltRounds);
      user.password = hashedPassword;
    }

    if (req.body.data.disease) {
      user.disease = req.body.data.disease;
    }

    if (req.body.data.age) {
      user.age = req.body.data.age;
    }

    if (req.body.data.phone) {
      user.phone = req.body.data.phone;
    }

    if (req.body.data.address) {
      user.address = req.body.data.address;
    }

    // Save updated user to database
    await user.save();

    // Return success response
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateDoctor = async (req, res) => {
  console.log(req.body.data);
  try {
    // Find user based on email
    const user = await Doctor.findOne({ email: req.body.data.email });

    // If user not found, return an error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if they are present in the request body
    if (req.body.data.name) {
      user.name = req.body.data.name;
    }

    if (req.body.data.password !== undefined) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.data.password, saltRounds);
      user.password = hashedPassword;
    }

    if (req.body.data.specification) {
      user.specification = req.body.data.specification;
    }

    if (req.body.data.phone) {
      user.phone = req.body.data.phone;
    }

    if (req.body.data.address) {
      user.address = req.body.data.address;
    }

    // Save updated user to database
    await user.save();

    // Return success response
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updatePharmacy = async (req, res) => {
  console.log(req.body.data);

  try {
    // Find user based on email
    const user = await Pharmacy.findOne({ email: req.body.data.email });

    // If user not found, return an error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if they are present in the request body
    if (req.body.data.name) {
      user.name = req.body.data.name;
    }

    if (req.body.data.password !== undefined) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.data.password, saltRounds);
      user.password = hashedPassword;
    }

    if (req.body.data.phone) {
      user.phone = req.body.data.phone;
    }

    // Save updated user to database
    await user.save();

    // Return success response
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateLab = async (req, res) => {
  try {
    // Find user based on email
    const user = await Lab.findOne({ email: req.body.data.email });

    // If user not found, return an error response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if they are present in the request body
    if (req.body.data.name !== undefined) {
      user.name = req.body.data.name;
    }

    if (req.body.data.password !== undefined) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.data.password, saltRounds);
      user.password = hashedPassword;
    }

    if (req.body.data.address !== undefined) {
      user.address = req.body.data.address;
    }

    if (req.body.data.phone !== undefined) {
      user.phone = req.body.data.phone;
    }

    if (req.body.data.specification !== undefined) {
      user.specification = req.body.data.specification;
    }

    // Save updated user to database
    await user.save();

    // Return success response
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const signup = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check if username is already taken
    const userExists = await Admin.findOne({ email: email });
    if (userExists) {
      return res.status(409).send("Mail already taken");
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      username: username,
      password: hashedPassword,
      email: email,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};
const login = async (req, res) => {
  const { password, email } = req.body.data;

  try {
    // Find the user by username
    const user = await Admin.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Invalid credentials");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};
export {
  addPatient,
  addPharmacy,
  addDoctor,
  addLab,
  getAllPatients,
  getAllPharmacies,
  getAllDoctors,
  getAllLabs,
  delPatient,
  delDoctor,
  delPharmacy,
  delLab,
  updatePatient,
  updateDoctor,
  updatePharmacy,
  updateLab,
  login,
  signup,
};
