/* eslint-disable no-unsafe-finally */
/* eslint-disable no-unused-vars */
const Checkout = require('../../db/models/checkout')
const Transaction = require('../../db/models/transaction')
const BestSelling = require('../../db/models/best_selling')

// Add Transaction DB
exports.addNewTransaction = async (id, order) => {
  // Loop through the order array
  for (const element of order) {
    // Create transaction records with the necessary fields, including store
    await Transaction.create({
      masterId: id,
      productId: element.idProduct,
      quantityPerProduct: element.count,
      productName: element.orderName,
      price: element.price,
      store: element.store // Ensure store is included
    })
  }

  for (let index = 0; index < order.length; index++) {
    try {
      const findBestSelling = await BestSelling?.findOne({
        where: {
          productId: order[index].idProduct,
          nameProduct: order[index].orderName,
          store: order[index].store // Ensure store is used in the query
        }
      })

      if (findBestSelling?.dataValues) {
        await BestSelling.update(
          {
            totalSelling:
              Number(findBestSelling.dataValues.totalSelling) +
              Number(order[index].count)
          },
          {
            where: {
              productId: order[index].idProduct,
              nameProduct: order[index].orderName
            }
          }
        )
      } else {
        await BestSelling.create({
          productId: order[index].idProduct,
          nameProduct: order[index].orderName,
          image: order[index].img,
          totalSelling: Number(order[index].count),
          store: order[index].store // Ensure store is included when creating
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

// Generate Invoice
exports.generateInvoice = async (req, res, next) => {
  const COMP_NAME = 'BISA NOTA'
  const date = new Date()
  const lengthChara = 5
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var randomString = ''

  for (var i = 0; i < lengthChara; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length)
    randomString += charSet.substring(randomPoz, randomPoz + 1)
  }

  const INV = 'INV'

  const subStringCompName = COMP_NAME.substring(0, 3)
  const timeStampDate = date.getTime()
  const chara = randomString
  const invoice = `${INV}${subStringCompName}#${timeStampDate}#${chara}`
  if (invoice) {
    return invoice
  }
}

// Post Checkout
exports.checkout = async (req, res, next) => {
  const body = req.body

  const invoice = await this.generateInvoice()

  try {
    const findOneCheckout = await Checkout?.findOne({
      where: {
        invoice: invoice,
        store: body.store
      }
    })

    if (!findOneCheckout?.getDataValue) {
      const creadtedCheckout = await Checkout.create({
        invoice: invoice,
        dateOrder: new Date(),
        dateCheckout: new Date(),
        totalPrice: body.totalPrice,
        store: body.store,
        cashierName: body.cashierName,
        totalQuantity: body.totalQuantity,
        createdBy: body.createdBy
      })

      if (creadtedCheckout?.getDataValue) {
        return res.status(200).json({
          message: 'Success',
          data: creadtedCheckout.dataValues
        })
      }
    } else {
      return res.status(403).json({
        message: 'Location Sudah Terdaftar'
      })
    }
  } catch (error) {
    console.log('ERROR =>', error)

    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}

// Edit Checkout
exports.editCheckout = async (req, res, next) => {
  const body = req.body

  try {
    console.log('body =>', body)
    console.log('body?.order =>', body?.order)

    await this.addNewTransaction(body.id, body?.order)

    const editCheckout = await Checkout?.update(
      {
        cashierName: body.cashierName,
        customerName: body.customerName,
        customerPhoneNumber: body.customerPhoneNumber,
        dateOrder: body.dateOrder,
        dateCheckout: body.dateCheckout,
        invoice: body.invoice,
        totalPrice: body.totalPrice,
        totalQuantity: body.totalQuantity,
        typePayment: body.typePayment,
        createdBy: body.cashierName,
        modifiedBy: body?.modifiedBy
      },
      {
        returning: true,
        where: {
          id: body.id,
          invoice: body.invoice,
          store: body.store
        }
      }
    ).then(([_, data]) => {
      return data
    })

    return res.status(200).json({
      message: 'Sukses Ubah Discount',
      data: editCheckout?.dataValues
    })
  } catch (error) {
    console.log('ERROR =>', error)
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}

// Delete Checkout
exports.deleteCheckout = async (req, res, next) => {
  const body = req.body

  try {
    const getId = await Checkout.destroy({
      where: {
        id: body.id,
        invoice: body.invoice,
        store: body.store
      },
      force: true
    })

    if (getId) {
      return res.status(200).json({
        message: 'Success Hapus Items'
      })
    } else {
      return res.status(403).json({
        message: 'Hapus Items Gagal'
      })
    }
  } catch (error) {
    console.log('ERROR =>', error)
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}
