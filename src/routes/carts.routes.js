import {
      Router
} from 'express';

import Carts from "../dao/dbManagers/carts.js";

import {
      handleTryErrorDB,
      validateData,
} from '../helpers/handleErrors.js';

const cartsRouter = Router();
const cartsManager = new Carts();


cartsRouter.get('/', async (req, res) => {

      try {

            let carts = await cartsManager.getAll();

            validateData(!carts, res, "No hay carritos en la base de datos");

            res.send({
                  status: "success",
                  payload: carts
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});

cartsRouter.get('/:cid', async (req, res) => {
      try {
            const {
                  cid
            } = req.params;

            const cart = await cartsManager.getById(cid);

            validateData(!cart, res, "No se encontró el carrito");

            res.send({
                  status: "success",
                  payload: cart,
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});

cartsRouter.post('/', async (req, res) => {

      try {

            let newCart = {
                  products: [],
                  id: Math.floor(Math.random() * 100) + 1,
            };

            let carts = await cartsManager.getAll();

            validateData(!carts, res, "No hay carritos en la base de datos");

            if (carts.some(cart => cart.id === newCart.id)) {

                  const maxAttempts = 100;
                  let attempts = 0;

                  newCart.id = Math.floor(Math.random() * 100) + 1;

                  while (carts.some(cart => cart.id === newCart.id) && attempts < maxAttempts) {

                        newCart.id = Math.floor(Math.random() * 100) + 1;
                        attempts++;

                  };

                  validateData(attempts === maxAttempts, res, "No se pudo generar un id para el carrito");

            };

            let result = await cartsManager.saveCart(newCart);

            validateData(!result, res, "No se pudo guardar el carrito");

            res.send({
                  status: "success",
                  payload: result
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});

cartsRouter.put('/:cid', async (req, res) => {
      try {
            const {
                  cid
            } = req.params;
            const {
                  products
            } = req.body;

            const result = await cartsManager.addProduct(cid, products);

            validateData(!result, res, "No se pudo actualizar el carrito");

            res.send({
                  status: 'success',
                  payload: result,
            });
      } catch (error) {
            handleTryErrorDB(error);
      }
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {

      try {

            const {
                  cid,
                  pid
            } = req.params;
            const {
                  quantity
            } = req.body;

            const result = await cartsManager.updateProductQuantity(cid, pid, quantity);

            validateData(!result, res, "No se pudo actualizar la cantidad del producto");

            res.send({
                  status: 'success',
                  payload: result,
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {

      try {

            const {
                  cid,
                  pid
            } = req.params;

            const result = await cartsManager.deleteProduct(cid, pid);

            validateData(!result, res, "No se pudo eliminar el producto");

            res.send({
                  status: 'success',
                  payload: result,
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});

cartsRouter.delete('/:cid', async (req, res) => {

      try {

            const {
                  cid
            } = req.params;

            const result = await cartsManager.deleteAllProducts(cid);

            validateData(!result, res, "No se pudo eliminar el carrito");

            res.send({
                  status: 'success',
                  payload: result,
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});

export default cartsRouter;