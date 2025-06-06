const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  duration: {
    type: String,
    enum: ['5 - 10 mins', '10 - 30 mins', '30 - 60 mins', 'มากกว่า 60 mins'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['ง่าย', 'ปานกลาง', 'ยาก'],
    required: true
  },
  imageUrl: {
    type: String,
    default: "" // ✅ ไม่จำเป็นต้องส่งมาก็ได้
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
