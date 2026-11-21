import mongoose from 'mongoose';

const audioCacheSchema = new mongoose.Schema(
  {
    audioId: { type: String, required: true, unique: true, index: true },
    dataBase64: { type: String, required: true },
    contentType: { type: String, default: 'audio/mpeg' },
    createdAt: { type: Date, default: Date.now, expires: 900 }, // TTL: Auto-delete after 15 mins
  },
  { timestamps: false }
);

const AudioCache = mongoose.models.AudioCache || mongoose.model('AudioCache', audioCacheSchema);

export default AudioCache;
