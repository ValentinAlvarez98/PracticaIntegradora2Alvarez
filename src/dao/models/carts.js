import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = mongoose.Schema({
      products: [{
            product: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "products", // Asegúrate de que el nombre aquí sea el mismo que el usado para el modelo de Product (products.js)
                  required: true,
            },
            quantity: {
                  type: Number,
                  required: true,
                  default: 1,
            },
      }, ],
      id: {
            type: Number,
            required: true,
      },
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;