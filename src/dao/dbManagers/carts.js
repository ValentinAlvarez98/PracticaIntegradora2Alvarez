// Se importan los modelos de la base de datos.
import cartsModel from '../models/carts.js';
import productsModel from '../models/products.js';

// Se importan las funciones de manejo de errores.
import {
      handleTryErrorDB,
      validateDataDB
} from '../../helpers/handleErrors.js';

// Se crea la clase CartsManager.
export default class CartsManager {

      constructor() {

            console.log("Trabajando con base de datos MongoDB");

      };

      // Se crea el método getAll.
      getAll = async () => {

            try {

                  // Se obtienen todos los carritos de la base de datos.
                  let carts = await cartsModel.find().lean();

                  // Se valida si no hay carritos y se envía un mensaje de error al cliente.
                  validateDataDB(!carts, "No hay carritos en la base de datos");

                  // Se retorna el array de carritos.
                  return carts;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea el método saveCart.
      saveCart = async (cart) => {

            try {

                  // Se busca un carrito con un id específico.
                  const existingCart = await cartsModel.findOne({
                        id: cart.id
                  });

                  // Si existe un carrito con ese id, se actualiza.
                  if (existingCart) {

                        existingCart.products = cart.products;
                        return await existingCart.save();

                        // Si no existe un carrito con ese id, se crea.
                  } else {

                        return await cartsModel.create(cart);

                  };

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea el método getById.
      getById = async (cid) => {

            try {

                  // Se busca un carrito con un id específico.
                  const cart = await cartsModel.findOne({
                        id: cid
                  }).populate('products.product');

                  // Se valida si no existe un carrito con ese id y se envía un mensaje de error al cliente.
                  validateDataDB(!cart, "No se encontró el carrito con el id especificado");

                  // Se retorna el carrito.
                  return cart;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea el método addProduct.
      addProduct = async (id, products) => {

            try {

                  // Se busca un carrito con un id específico.
                  const cart = await cartsModel.findOne({
                        id
                  });

                  // Se valida que exista un carrito con ese id.
                  validateDataDB(!cart, "No existe un carrito con ese id");

                  for (const product of products) {

                        // Se obtiene el id del producto del objeto recibido.
                        const productId = product.product;

                        // Se busca el producto  por su id en el carrito actual.
                        const existingProduct = cart.products.find((p) => p.product.toString() === productId);

                        // Si el producto no existe en el carrito, se agrega.
                        if (!existingProduct) {

                              // Se busca el producto en la base de datos por su id.
                              const productToAdd = await productsModel.findById(productId);

                              // Se valida que exista un producto con ese id.
                              validateDataDB(!productToAdd, "No existe un producto con ese id");

                              // Se agrega el producto al carrito con su cantidad correspondiente.
                              cart.products.push({
                                    product: productToAdd._id,
                                    quantity: product.quantity,
                              });

                        } else {

                              handleTryErrorDB("El producto ya existe en el carrito");

                        };

                  };

                  const result = await cart.save();

                  return result;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea el método deleteById.
      deleteById = async id => {

            try {

                  // Se elimina el carrito de la base de datos utilizando el id.
                  let result = await cartsModel.deleteOne({
                        id: id
                  });

                  // Se valida si se eliminó el carrito y se envía un mensaje de error al cliente si no se eliminó.
                  validateDataDB(result, "Se eliminó el carrito de la base de datos");

                  return result;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea el método updateProductQuantity.
      updateProductQuantity = async (cartId, productId, quantity) => {

            try {

                  const cart = await cartsModel.findOne({
                        id: cartId
                  });

                  // Se valida si existe un carrito con ese id.
                  validateDataDB(!cart, "No existe un carrito con ese id");

                  // Se busca el producto en el carrito por su id.
                  const product = cart.products.find((product) => product.product.toString() === productId);

                  // Se valida si el producto existe en el carrito.
                  validateDataDB(!product, "El producto no existe en el carrito");

                  product.quantity = quantity;

                  const result = await cart.save();

                  // Se valida si se pudo actualizar la cantidad del producto y se envía un mensaje de error al cliente si no se pudo.
                  validateDataDB(!result, "No se pudo actualizar la cantidad del producto");

                  return result;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea el método deleteProduct.
      deleteProduct = async (cartId, productId) => {

            try {

                  const cart = await cartsModel.findOne({
                        id: cartId
                  });

                  // Se valida si existe un carrito con ese id.
                  validateDataDB(!cart, "No existe un carrito con ese id");

                  const productIndex = cart.products.findIndex((product) => product.product.toString() === productId);

                  // Se valida si el producto existe en el carrito.
                  if (productIndex === -1) {
                        validateDataDB(true, "El producto no existe en el carrito");
                  }

                  cart.products.splice(productIndex, 1);

                  const result = await cart.save();

                  // Se valida si se pudo eliminar el producto del carrito y se envía un mensaje de error al cliente si no se pudo.
                  validateDataDB(!result, "No se pudo eliminar el producto del carrito");

                  return result;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea el método deleteAllProducts.
      deleteAllProducts = async (cartId) => {

            try {

                  const cart = await cartsModel.findOne({
                        id: cartId
                  });

                  // Se valida si existe un carrito con ese id.
                  validateDataDB(!cart, "No existe un carrito con ese id");

                  cart.products = [];

                  const result = await cart.save();

                  return result;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

};