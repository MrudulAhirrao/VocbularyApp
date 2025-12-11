import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: true },
  lexicalCategory: String,
  definition: String,
  example: String,
  audioUrl: String,
  pronunciation: String,
}, { timestamps: true });

// Check if model exists to prevent compiling it twice in dev mode
const Word = mongoose.models.Word || mongoose.model('Word', WordSchema);

export default Word;