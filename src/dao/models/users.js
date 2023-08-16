import mongoose from 'mongoose';

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({

      first_name: {
            type: String,
            required: true,
      },

      last_name: {
            type: String,
            required: true,
      },

      email: {
            type: String,
            required: true,
            unique: true,
      },

      age: {
            type: Number,
            required: true,
      },

      password: {
            type: String,
            required: true,
      },

      role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
      },

      phone: {
            type: String,
      },

      date_created: {
            type: Date,
            default: Date.now,
      }

});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;