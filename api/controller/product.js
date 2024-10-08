/* eslint-disable no-unsafe-finally */
/* eslint-disable no-unused-vars */
// Connect DB
const Product = require('../../db/models/product')
const { Op } = require('sequelize')

// Get Product By Location Store
exports.getProductByLocationSuperAdmin = async (req, res, next) => {
  const { store } = req.query
  try {
    const getAllProduct = await Product.findAll({
      where: {
        store: store,
        status: true
      }
    }).then((res) =>
      res.map((items) => {
        const getData = {
          ...items.dataValues
        }
        return getData
      })
    )

    return res.status(200).json({
      message: 'Success',
      data: getAllProduct?.length > 0 ? getAllProduct : []
    })
  } catch (error) {
    console.log('Error =>', error)
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}

// Get All In Cashier List
exports.getAllProduct = async (req, res, next) => {
  const { nameProduct, category, store } = req.query
  try {
    const filters = {}
    if (nameProduct || category) {
      filters.nameProduct = {
        [Op.like]: `${nameProduct}%`
      }
      filters.category = {
        [Op.like]: `${category}%`
      }
      filters.store = store
      filters.status = true
    }

    const getAllProduct = await Product.findAll({ where: filters }).then(
      (res) =>
        res.map((items) => {
          const getData = {
            ...items.dataValues
          }
          return getData
        })
    )

    return res.status(200).json({
      message: 'Success',
      data: getAllProduct?.length > 0 ? getAllProduct : []
    })
  } catch (error) {
    console.log('Error =>', error)
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}

// Get All In Table
exports.getAllProductInTable = async (req, res, next) => {
  const { store } = req.query
  try {
    const getAllProduct = await Product.findAll({
      where: {
        store: store
      }
    }).then((res) =>
      res.map((items) => {
        const getData = {
          ...items.dataValues
        }
        return getData
      })
    )

    return res.status(200).json({
      message: 'Success',
      data: getAllProduct?.length > 0 ? getAllProduct : []
    })
  } catch (error) {
    console.log('Error =>', error)
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}

// Function Post Add Form Product
exports.postAddProduct = async (req, res, next) => {
  try {
    const {
      nameProduct,
      category,
      status,
      description,
      price,
      createdBy,
      image,
      option,
      store
    } = req.body

    const postData = await Product.create({
      nameProduct: nameProduct,
      category: category,
      description: description,
      price: price,
      status: status,
      option: option,
      createdBy: createdBy,
      image: image,
      store: store
    })

    return res.status(200).json({
      status: 'success',
      data: postData
    })
  } catch (error) {
    console.log('Error =>', error)
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}

// Render Edit Form Product
exports.renderFormEdit = (req, res, next) => {
  //   const getProduct = product.filter(
  //     (items) => items.id === Number(req.params.id)
  //   )
  //   const [prouduct] = getProduct
  //   res.render('admin/formProduct.ejs', {
  //     pageTitle: 'Edit Product',
  //     admin: true,
  //     url: req.protocol + '://' + req.header.host,
  //     onPage: 'edit-product',
  //     navigationActive: {
  //       list: 'list',
  //       cart: 'cart',
  //       addProduct: 'add-product',
  //       editProduct: 'edit-product',
  //       reportSelling: 'report-selling'
  //     },
  //     urlNavigation: {
  //       list: '/admin/list',
  //       cart: '/admin/cart',
  //       addProduct: '/admin/add-product',
  //       editProduct: '/admin/edit-product',
  //       reportSelling: '/admin/report-selling'
  //     },
  //     item: {
  //       id: prouduct.id,
  //       img: prouduct.img,
  //       category: prouduct.category,
  //       product: prouduct.productName,
  //       price: prouduct.price
  //     }
  //   })
}

// Function Put Edit Form Product
// exports.EditProduct = (req, res, next) => {
//   const getIndexProduct = product.findIndex(
//     (items) => items.id === Number(req.params.id)
//   )
//   console.log('getIndexProduct =>', getIndexProduct)

//   product[getIndexProduct] = {
//     id: req.params.id,
//     img: req.body.image,
//     category: req.body.category,
//     productName: req.body.product,
//     price: req.body.price
//   }

//   res.redirect('/admin/list')
// }

// Delete
// exports.deleteProduct = (req, res, next) => {
//   const products = product.filter((items) => items.id !== Number(req.body.id))
//   console.log(products)
//   product = products
//   res.redirect('/admin/list')
// }

// Report Selling
// exports.showGraph = (req, res, next) => {
//   res.render('admin/reportSelling.ejs', {
//     pageTitle: 'Report Selling',
//     admin: true,
//     url: req.protocol + '://' + req.header.host,
//     onPage: 'report-selling',
//     navigationActive: {
//       list: 'list',
//       cart: 'cart',
//       addProduct: 'add-product',
//       editProduct: 'edit-product',
//       reportSelling: 'report-selling'
//     },
//     urlNavigation: {
//       list: '/admin/list',
//       cart: '/admin/cart',
//       addProduct: '/admin/add-product',
//       editProduct: '/admin/edit-product',
//       reportSelling: '/admin/report-selling'
//     },
//     labels: [
//       'Januari',
//       'Februari',
//       'Maret',
//       'April',
//       'Mei',
//       'Juni',
//       'Juli',
//       'Agustus',
//       'September',
//       'Oktober',
//       'November',
//       'Desember'
//     ],
//     dataGraph: dataGraph.data[`${new Date().getFullYear()}`]
//   })
// }

// Filter Report Selling By Year
// exports.filterGraph = (req, res, next) => {
//   const data = dataGraph.data[req.body.year]
//   res.render('admin/reportSelling.ejs', {
//     pageTitle: 'Report Selling',
//     admin: true,
//     url: req.protocol + '://' + req.header.host,
//     onPage: 'report-selling',
//     navigationActive: {
//       list: 'list',
//       cart: 'cart',
//       addProduct: 'add-product',
//       editProduct: 'edit-product',
//       reportSelling: 'report-selling'
//     },
//     urlNavigation: {
//       list: '/admin/list',
//       cart: '/admin/cart',
//       addProduct: '/admin/add-product',
//       editProduct: '/admin/edit-product',
//       reportSelling: '/admin/report-selling'
//     },
//     labels: [
//       'Januari',
//       'Februari',
//       'Maret',
//       'April',
//       'Mei',
//       'Juni',
//       'Juli',
//       'Agustus',
//       'September',
//       'Oktober',
//       'November',
//       'Desember'
//     ],
//     dataGraph: data
//   })
// }

// Render Cart
// exports.renderCart = (req, res, next) => {
//   res.render('user/cart.ejs', {
//     url: req.protocol + '://' + req.header.host,
//     pageTitle: 'Cart Product',
//     onPage: 'cart',
//     admin: true,
//     navigationActive: {
//       list: 'list',
//       cart: 'cart',
//       addProduct: 'add-product',
//       editProduct: 'edit-product',
//       reportSelling: 'report-selling'
//     },
//     urlNavigation: {
//       list: '/admin/list',
//       cart: '/admin/cart',
//       addProduct: '/admin/add-product',
//       editProduct: '/admin/edit-product',
//       reportSelling: '/admin/report-selling'
//     }
//   })
// }
