import fs from 'fs';

import path from 'path';

import Carts from '../dbManagers/carts.js';
import ProductsFs from './products.js';

const cartsManager = new Carts();
const productsFsManager = new ProductsFs();

export default class CartFsManager {

      constructor() {

            this.path = './data/carts.json';
            this.carts = [];

      };

      loadCarts = async () => {

            try {

                  if (!fs.existsSync(this.path)) {

                        console.log("No existe el archivo de carritos");
                        this.carts = [];

                  };

                  const jsonData = await fs.promises.readFile(this.path, 'utf-8');

                  this.carts = JSON.parse(jsonData);

                  return this.carts;

            } catch (error) {

                  console.log("Error en loadProducts: ", error);

            };

      };

      createFile = async () => {

            try {

                  let carts = await cartsManager.getAll();

                  if (!carts) {

                        console.log("No hay carritos en la base de datos");

                  };

                  const jsonData = JSON.stringify(carts);

                  await fs.promises.writeFile(this.path, jsonData);


            } catch (error) {

                  console.log("Error en createFile: ", error);

            };

      };

};