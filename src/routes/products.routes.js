// Se importa el enrutador de Express.
import {
      Router
} from 'express';

// Se importan los managers de productos.
import ProductsManager from "../dao/dbManagers/products.js";
import ProductsFsManager from "../dao/fileManagers/products.js";

// Se importan las funciones de manejo de errores desde el helper.
import {
      handleTryError,
      handleTryErrorDB,
      validateData,
      validateFields,
} from '../helpers/handleErrors.js';

// Se crea el enrutador.
const productsRouter = Router();

// Se crean las instancias de los managers de productos.
const productsManager = new ProductsManager();
const productsFsManager = new ProductsFsManager();

// Se crea el endpoint para obtener todos los productos.
productsRouter.get('/', async (req, res) => {

      try {

            // Se obtienen los parámetros de consulta (si no se obtiene un valor, se asigna un valor por defecto).
            let {
                  limit = 10, page = 1, sort, query
            } = req.query;

            // Se convierten las variables para evitar errores.
            limit = parseInt(limit);
            page = parseInt(page);
            query !== undefined ? query = query.toString() : query = undefined;

            // Se realiza la consulta para obtener todos los productos.
            const result = await productsManager.getAll({
                  limit,
                  page,
                  sort,
                  query
            });

            // Se envía la respuesta al cliente.
            res.send({
                  ...result
            });

      } catch (error) {

            // Se maneja el error y se envía un mensaje de error al cliente.
            handleTryError(res, error);

      };

});

// Se crea el endpoint para obtener un producto por su id.
productsRouter.get('/:id', async (req, res) => {

      try {

            const {
                  id
            } = req.params;

            // Se obtiene el producto por su id utilizando el manager de productos.
            const product = await productsManager.getById(id);

            // Se valida que el producto exista.
            validateData(!product, res, 'Producto no encontrado');

            // Se envía el producto al cliente.
            res.send({
                  status: 'success',
                  payload: product
            });

      } catch (error) {

            // Se maneja el error y se envía un mensaje de error al cliente.
            handleTryErrorDB(error);

      };

});

// Se crea el endpoint para crear un nuevo producto.
productsRouter.post('/', async (req, res) => {

      try {

            // Se validan los campos requeridos.
            const isValid = validateFields(req.body, ['title', 'description', 'code', 'price', 'status', 'stock', 'category']);

            // Se valida que ningún campo requerido haya quedado vacío.
            validateData(!isValid, res, 'Faltan datos obligatorios');

            // Se crea el producto a agregar con un id aleatorio.
            const newProduct = {
                  ...req.body,
                  id: Math.floor(Math.random() * 100) + 1
            };

            // Se busca si ya existe un producto con el mismo código.
            const existingProduct = await productsManager.getByCode(newProduct.code);

            // Se valida que no exista un producto con el mismo código.
            validateData(existingProduct, res, 'Ya existe un producto con ese código');

            // Se hace un máximo de 100 intentos para generar un id único para el producto a agregar.
            let attempts = 0;
            const maxAttempts = 100;

            while (attempts < maxAttempts) {

                  const product = await productsManager.getById(newProduct.id);

                  if (!product) {
                        break;
                  }

                  newProduct.id = Math.floor(Math.random() * 100) + 1;
                  attempts++;

            };

            // Se valida que se haya podido generar un id único para el producto después de los 100 intentos.
            validateData(attempts === maxAttempts, res, 'No se pudo generar un id para el producto');

            // Se guarda el nuevo producto utilizando saveProduct del manager.
            const result = await productsManager.saveProduct(newProduct);

            // Se valida que se haya podido guardar el producto.
            validateData(!result, res, 'No se pudo guardar el producto');

            // Se actualiza el archivo de productos.
            await productsFsManager.getAll();

            // Se envía la respuesta.
            res.send({
                  status: 'success',
                  payload: `Producto con id: ${newProduct.id}, guardado correctamente en la base de datos`
            });

      } catch (error) {

            // Se maneja el error.
            handleTryErrorDB(error);

      };

});

// Se crea el endpoint para actualizar un producto por su id.
productsRouter.put('/:id', async (req, res) => {

      try {

            const {
                  id
            } = req.params;

            // Se validan los campos requeridos.
            const isValid = validateFields(req.body, ['title', 'description', 'code', 'price', 'status', 'stock', 'category']);

            // Se valida que ningún campo requerido haya quedado vacío.
            validateData(!isValid, res, 'Faltan datos obligatorios');

            // Se busca el producto por su id.
            const productToUpdate = await productsManager.getById(id);

            // Se valida que el producto exista.
            validateData(!productToUpdate, res, 'Producto no encontrado');

            // Se crea el producto actualizado.
            const productUpdated = {
                  ...productToUpdate,
                  ...req.body
            };

            // Se actualiza el producto utilizando updateById del manager.
            const result = await productsManager.updateById(id, productUpdated);

            // Se valida que se haya podido actualizar el producto.
            validateData(!result, res, 'No se pudo actualizar el producto');

            // Se actualiza el archivo de productos.
            await productsFsManager.getAll();

            // Se envía la respuesta.
            res.send({
                  status: 'success',
                  payload: `Producto con id: ${id}, actualizado correctamente en la base de datos`
            });

      } catch (error) {

            // Se maneja el error y se envía un mensaje de error al cliente.
            handleTryErrorDB(error);

      };

});

// Se crea el endpoint para eliminar un producto por su id.
productsRouter.delete('/:id', async (req, res) => {

      try {

            const {
                  id
            } = req.params;

            // Se busca el producto por su id.
            const productToDelete = await productsManager.getById(id);

            // Se valida que el producto exista.
            validateData(!productToDelete, res, 'Producto no encontrado');

            // Se elimina el producto utilizando deleteById del manager.
            const result = await productsManager.deleteById(id);

            // Se valida que se haya eliminado el producto.
            validateData(!result, res, 'No se pudo eliminar el producto');

            // Se actualiza el archivo de productos.
            await productsFsManager.getAll();

            // Se envía la respuesta.
            res.send({
                  status: 'success',
                  payload: `Producto con id: ${id}, eliminado correctamente de la base de datos`
            });

      } catch (error) {

            // Se maneja el error y se envía un mensaje de error al cliente.
            handleTryErrorDB(error);

      };

});

export default productsRouter;