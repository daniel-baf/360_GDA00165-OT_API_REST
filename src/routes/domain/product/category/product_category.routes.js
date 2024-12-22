import express from "express";
import {
  createProductCategory,
  listProductsCategory,
  searchProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "@models/product/product_category.dao.js";

const product_category_router = express.Router();

product_category_router.post("/create", async (req, res) => {
  try {
    let { nombre, descripcion } = req.body;
    if (!nombre || !descripcion) throw new Error("Los campos son obligatorios");

    return res
      .status(201)
      .json(await createProductCategory({ nombre, descripcion }));
  } catch (error) {
    res
      .status(500)
      .send(`No ha sido posible crear la categoria de producto: ${error}`);
  }
});

product_category_router.get("/list", async (req, res) => {
  try {
    res.status(200).json(await listProductsCategory());
  } catch (error) {
    res
      .status(500)
      .send(
        `No ha sido posible recuperar las categorias de productos: ${error}`
      );
  }
});

product_category_router.get("/list/:limit/:offset", async (req, res) => {
  try {
    let { limit, offset } = req.params;
    res.status(200).json(await listProductsCategory(limit, offset));
  } catch (error) {
    res
      .status(500)
      .send(
        `No ha sido posible recuperar las categorias de productos: ${error}`
      );
  }
});

product_category_router.put("/update/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let { nombre, descripcion } = req.body;
    if (!id) throw new Error("El id es un campo obligatorio");

    return res
      .status(200)
      .json(await updateProductCategory({ nombre, descripcion, id }));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

product_category_router.delete("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) throw new Error("El id es un campo obligatorio");
    return res.status(200).json(await deleteProductCategory(id));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default product_category_router;
