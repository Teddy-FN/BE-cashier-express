/* eslint-disable no-undef */
const express = require('express')

const router = express.Router()

const productController = require('../controller/product')

// Authorization
const authorization = require('../../utils/authorization')

// Post New Product
router.post('/add-product', authorization, productController?.postAddProduct)

// Get Product In Cashier List By Location
router.get('/get-product', authorization, productController?.getAllProduct)

// Get Product In By Location Super Admin List
router.get(
  '/get-product-by-super-admin',
  authorization,
  productController?.getProductByLocationSuperAdmin
)

// Get Product In Table
router.get(
  '/get-product-all',
  authorization,
  productController?.getAllProductInTable
)

// Function Delete
// router.post('/delete-product', productController?.deleteProduct)

// Render Form Edit Product
// router.get('/edit-product/:id', productController?.renderFormEdit)

// Router delete Image
// router.post('/delete-image', productController?.deleteImage)

// Router Render Category
// router.get('/add-category', productController?.renderAddCategory)

// Function Post Edit Product
// router.post(
//   '/edit-product/:id',
//   upload.single('image'),
//   productController?.EditProduct
// )

module.exports = router
