const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  role: { type: String, default: 'technician' },
  isActive: { type: Boolean, default: true },
});

const Technician = mongoose.models.Technician || mongoose.model('Technician', technicianSchema);

async function seedTechnician() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    let tech = await Technician.findOne();
    if (!tech) {
      console.log('No technician found. Creating one...');
      tech = await Technician.create({
        name: 'John Doe',
        phone: '9876543210',
        email: 'john@example.com',
        role: 'technician',
      });
      console.log('Created technician:', tech);
    } else {
      console.log('Technician already exists:', tech);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedTechnician();
