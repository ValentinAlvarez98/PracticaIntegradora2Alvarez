// Se importan las dependencias necesarias.
import {
      Router
} from 'express';
import {
      handleTryError,
      handleTryErrorDB,
      validateData
} from '../helpers/handleErrors.js';
import {
      checkSession,
      ifSession,
      isAdmin,
      checkGithubSession,
      validateEmail
} from '../helpers/handleSessions.js';
import {
      authToken
} from '../utils.js';
import Products from "../dao/dbManagers/products.js";
import Carts from "../dao/dbManagers/carts.js";
import Users from "../dao/dbManagers/users.js";

import ProductsFs from "../dao/fileManagers/products.js";

// Se crean las instancias de los Managers.
const productsManager = new Products();
const cartsManager = new Carts();
const usersManager = new Users();

const productsFsManager = new ProductsFs();

// Se crea el enrutador.
const router = Router();

// Ruta para mostrar el chatBox.
router.get('/chat', checkSession, checkGithubSession, async (req, res) => {

      try {

            // Renderiza la vista chat.
            res.render('chat');

      } catch {

            // Manejo de errores mediante la función handleTryError.
            handleTryError(res, error);

      };

});

// Ruta para mostrar los productos en tiempo real.
router.get('/realtimeproducts', checkSession, checkGithubSession, async (req, res) => {

      try {

            const userData = req.cookies.userData;

            // Obtiene todos los productos desde el fileManager.
            let products = await productsFsManager.getAll();

            // Valida si no hay productos y envía un mensaje de error al cliente.
            validateData(!products, res, "No hay productos en la base de datos");

            // Renderiza la vista realtimeproducts, pasando los productos como parámetro.
            res.render('realtimeproducts', {
                  products,
                  userName: userData.first_name,
                  userRole: userData.role
            });

      } catch (error) {

            // Manejo de errores mediante la función handleTryError.
            handleTryError(res, error);

      };

});

// Ruta para obtener todos los productos o una cantidad limitada de productos.
router.get('/', checkSession, checkGithubSession, async (req, res) => {

      try {

            // Se obtienen los parámetros de la consulta.
            const {
                  page,
                  limit,
                  sort,
                  query
            } = req.query;

            const userData = req.cookies.userData;

            // Se inicializa la variable isAdmin.
            let isUser;

            // Se valida si el usuario es user.
            userData.role === "user" ? isUser = true : isUser = false;

            // Se obtienen los datos de los productos desde el Manager.
            const productsData = await productsManager.getAll({
                  limit,
                  page,
                  sort,
                  query,
            });

            // Se realiza una copia de los productos para evitar problemas que da handlebars con los objetos.
            productsData.payload.products = productsData.payload.products.map((product) => {
                  return {
                        ...JSON.parse(JSON.stringify(product)),
                  };
            });

            // Se renderiza la vista products, pasando los datos de los productos como parámetros.
            res.render('products', {
                  products: productsData.payload.products,
                  hasPrevPage: productsData.hasPrevPage,
                  hasNextPage: productsData.hasNextPage,
                  prevPage: productsData.prevPage,
                  nextPage: productsData.nextPage,
                  userName: userData.first_name,
                  userRole: userData.role,
                  isUser
            });

      } catch (error) {

            // Manejo de errores mediante la función handleTryError.
            handleTryError(res, error);

      };

});

// Ruta para obtener un producto por su id.
router.get('/products/:id', checkSession, checkGithubSession, async (req, res) => {

      try {

            // Se obtiene el id del producto desde los parámetros.
            const {
                  id
            } = req.params;

            // Se obtiene el producto desde el Manager.
            const product = await productsManager.getById(id);

            // Valida que el producto exista.
            validateData(!product, res, 'Producto no encontrado');

            // Renderiza la vista productDetails, pasando el producto como parámetro.
            res.render('productDetails', product);

      } catch (error) {

            // Manejo de errores mediante la función handleTryError.
            handleTryError(res, error);

      };

});

// Ruta para obtener un carrito por su id.
router.get('/carts/:cartId', checkSession, checkGithubSession, async (req, res) => {

      try {

            // Se obtiene el id del carrito desde los parámetros.
            const {
                  cartId
            } = req.params;

            // Se obtiene el carrito desde el Manager.
            const cart = await cartsManager.getById(cartId);

            // Se valida que el carrito exista.
            validateData(!cart, res, 'Carrito no encontrado');

            // Se transforma el carrito a un objeto para poder modificarlo.
            const cartData = cart.toObject();

            // Se inicializa el subtotal.
            let subtotal = 0;

            // Se calcula el subtotal del carrito.
            cartData.products.forEach((product) => {
                  subtotal += product.product.price * product.quantity;
            });

            // Se agrega el subtotal al carrito.
            cartData.subtotal = subtotal;

            // Se renderiza la vista cartDetail, pasando el carrito como parámetro.
            res.render('cartDetail', {
                  cart: cartData,
            });

      } catch (error) {

            handleTryError(res, error);

      };

});

// Ruta para obtener el perfil del usuario.
router.get('/profile', checkSession, async (req, res) => {

      try {

            const userData = req.cookies.userData;

            const id = userData.id;

            const admin = isAdmin(userData.email, userData.password);

            validateData(admin !== false, res, "No se puede acceder al perfil del usuario administrador");

            const user = await usersManager.getUser(null, id);

            validateData(!user, res, "No se pudo obtener el perfil del usuario");

            res.render('profile', {
                  userName: userData.first_name,
                  userLastName: user.last_name,
                  userEmail: user.email,
                  userRole: userData.role,
                  userPhone: user.phone ? user.phone : "Teléfono",
                  invalidEmail: validateEmail(user.email)
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});

router.get('/register', ifSession, (req, res) => {
      try {

            res.render('register');

      } catch (error) {

            handleTryError(res, error);

      };
});

router.get('/login', ifSession, (req, res) => {

      try {

            res.render('login');

      } catch (error) {

            handleTryError(res, error);

      };

});

export default router;