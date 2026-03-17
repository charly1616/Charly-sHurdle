import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true // Para mantener la consistencia con tus IDs actuales
  },
  FullName: {
    type: String,
    required: true,
    trim: true
  },
  Color: {
    type: String,
    default: '#000000'
  },
  Icon: {
    type: String,
    default: 'fa-solid fa-user'
  },
  NickName: {
    type: String,
    trim: true
  },
  Questions: [{
    type: Number // Guardamos el arreglo de IDs de preguntas
  }],
  tags: [{
    type: String // Guardamos los tags como un arreglo de strings
  }],
  SuccessText: {
    type: String,
    trim: true
  }
}, {
  versionKey: false
});

const Friend = mongoose.model('Friend', friendSchema);

export default Friend;