// Se importa el modelo de productos.
import productsModel from "../models/products.js";

// Se importan las funciones de manejo de errores desde el helper.
import {
      handleTryErrorDB,
      validateDataDB
} from '../../helpers/handleErrors.js';

// Se crea la clase ProductsManager.
export default class ProductsManager {

      constructor() {
            console.log("Trabajando con base de datos MongoDB");
      };

      // Se crea getAll para obtener todos los productos de la base de datos.
      getAll = async ({
            limit = 10,
            page = 1,
            sort,
            query
      }) => {

            try {

                  // Se definen las opciones de paginación y búsqueda.
                  const options = {
                        page: page,
                        limit: limit
                  };

                  const searchQuery = {};

                  // Se crea la consulta de búsqueda si se especifica un query.
                  if (query) {

                        // Se crea la expresión regular para buscar el query en los campos title, category y code.
                        searchQuery.$or = [{
                              title: {
                                    // Se utiliza el operador regex para buscar el query en los campos title, category y code. Con la opción $options: "i" para que no distinga entre mayúsculas y minúsculas.
                                    $regex: query,
                                    $options: "i"
                              }
                        }, {
                              category: {
                                    $regex: query,
                                    $options: "i"
                              }
                        }, {
                              code: {
                                    $regex: query,
                                    $options: "i"
                              }
                        }];
                  }

                  // Se define el orden de los productos en caso de que se especifique un sort.
                  if (sort === "asc") {
                        options.sort = {
                              price: 1
                        };
                  } else if (sort === "desc") {
                        options.sort = {
                              price: -1
                        };
                  }

                  // Se hace la consulta a la base de datos utilizando la paginación.
                  const products = await productsModel.paginate(searchQuery, options);

                  // Se crea y devuelve la respuesta en el formato que se requiere.
                  return {
                        status: "success",
                        payload: {
                              products: products.docs,
                        },
                        totalPages: products.totalPages,

                        page: products.page,
                        hasPrevPage: products.hasPrevPage,
                        hasNextPage: products.hasNextPage,

                        // Se utiliza el operador ternario para verificar si hay una página anterior o siguiente.
                        prevPage: products.hasPrevPage ? products.prevPage : null,
                        nextPage: products.hasNextPage ? products.nextPage : null,

                        // Se crean los links para la paginación en caso de que existan páginas anteriores o siguientes.
                        prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}` : null,
                        nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}` : null
                  };

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea getById para obtener un producto por su id de la base de datos.
      getById = async (id) => {

            try {

                  // Se busca el producto por su id en la base de datos.
                  const product = await productsModel.findOne({
                        id
                  }).lean();

                  // Si no se encuentra el producto, se muestra un mensaje de error.
                  validateDataDB(!product, "El id ingresado no pertenece a ningún producto");

                  return product;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea getByCode para obtener un producto por su código de la base de datos.
      getByCode = async (code) => {

            try {

                  // Se busca el producto por su código en la base de datos.
                  const product = await productsModel.findOne({
                        code
                  }).lean();

                  // Si no se encuentra el producto, se muestra un mensaje de error.
                  validateDataDB(!product, "El código ingresado no pertenece a ningún producto");

                  return product;
            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea saveProduct para guardar un producto en la base de datos.
      saveProduct = async (product) => {

            try {

                  // Se crea el producto en la base de datos.
                  const result = await productsModel.create(product);

                  validateDataDB(!result, "No se pudo guardar el producto en la base de datos");

                  console.log("Producto guardado en la base de datos");

                  return result;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea updateById para actualizar un producto por su id en la base de datos.
      updateById = async (id, product) => {

            try {

                  // Se actualiza el producto por su id en la base de datos.
                  const result = await productsModel.updateOne({
                        id
                  }, product);

                  validateDataDB(!result, "No se pudo actualizar el producto en la base de datos");

                  console.log("Producto actualizado en la base de datos");

                  return result;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Se crea deleteById para eliminar un producto por su id en la base de datos.
      deleteById = async (id) => {

            try {
                  // Se elimina el producto por su id en la base de datos.
                  const result = await productsModel.deleteOne({
                        id
                  });

                  validateDataDB(!result, "No se pudo eliminar el producto de la base de datos");

                  console.log("Producto eliminado de la base de datos");

                  return result;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

};