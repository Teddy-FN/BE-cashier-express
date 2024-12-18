/* eslint-disable no-unsafe-finally */
/* eslint-disable no-unused-vars */
const InvoiceFooter = require('../../db/models/invoice_footer')
const { Op } = require('sequelize')

// Get Logo Invoice By Location
exports.getInvoiceFooterByLocation = async (req, res, next) => {
  const { store } = req.query
  try {
    const invoiceFooter = await InvoiceFooter.findAll({
      where: {
        store: store,
        isActive: true
      }
    })
    return res.status(200).json({
      message: 'Success',
      data:
        invoiceFooter?.length > 0
          ? invoiceFooter?.map((items) => {
              return {
                ...items?.dataValues,
                footerList: JSON?.parse(items?.dataValues?.footerList)
              }
            })
          : []
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

// Get Logo Using To Invoice
exports.getInvoiceFooterByIsActive = async (req, res, next) => {
  const { store } = req.query
  try {
    const invoiceFooter = await InvoiceFooter.findAll({
      where: {
        isActive: true,
        store: store
      }
    })
    return res.status(200).json({
      message: 'Success',
      data:
        invoiceFooter?.length > 0
          ? invoiceFooter?.map((items) => {
              return {
                ...items?.dataValues,
                footerList: JSON?.parse(items?.dataValues?.footerList)
              }
            })
          : []
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

// Get All Social Media Invoice
exports.getAllInvoiceFooter = async (req, res, next) => {
  const {
    store,
    page = 1,
    size = 10,
    status = 'all',
    isActive = 'all'
  } = req.query // Default page = 1, size = 10
  const limit = parseInt(size)
  const offset = (parseInt(page) - 1) * limit

  // Build dynamic filter based on status and isActive
  let whereCondition = { store: store }

  if (status === 'true') {
    whereCondition.status = true
  } else if (status === 'false') {
    whereCondition.status = false
  }

  if (isActive === 'true') {
    whereCondition.isActive = true
  } else if (isActive === 'false') {
    whereCondition.isActive = false
  }

  try {
    const { count, rows: invoiceFooter } = await InvoiceFooter.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset
    })

    return res.status(200).json({
      message: 'Success',
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data:
        invoiceFooter?.length > 0
          ? invoiceFooter?.map((items) => {
              return {
                ...items?.dataValues,
                footerList: JSON?.parse(items?.dataValues?.footerList)
              }
            })
          : []
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

// Post New Social Media Invoice
exports.postNewInvoiceFooter = async (req, res, next) => {
  const { name, footerList, isActive, status, createdBy, store } = req.body
  try {
    const findOneInvoiceFooter = await InvoiceFooter?.findOne({
      where: {
        name: name
      }
    })

    if (!findOneInvoiceFooter?.getDataValue) {
      const postData = await InvoiceFooter.create({
        name: name,
        footerList: footerList,
        isActive: isActive,
        store: store,
        status: status,
        createdBy: createdBy
      })
      return res.status(200).json({
        status: 'success',
        data: postData
      })
    } else {
      return res.status(403).json({
        message: 'Template Name Invoice Footer Sudah Tersedia'
      })
    }
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

// Edit InvoiceFooter By Id
exports.editInvoiceFooterById = async (req, res, next) => {
  const body = req.body
  try {
    const getDuplicate = await InvoiceFooter.findOne({
      where: {
        name: body.name,
        store: body.store
      }
    })

    const bodyFooterList = JSON.parse(body.footerList)
    const duplicateFooterList = JSON.parse(getDuplicate.dataValues.footerList)

    if (
      !getDuplicate?.dataValues ||
      !getDuplicate?.dataValues?.status === body?.status ||
      bodyFooterList.length !== duplicateFooterList.length
    ) {
      const editInvoiceFooter = await InvoiceFooter?.update(
        {
          name: body.name,
          footerList: body.footerList,
          createdBy: body.createdBy,
          modifiedBy: body?.modifiedBy,
          status: body.status,
          isActive: false
        },
        {
          returning: true,
          where: {
            id: body.id
          }
        }
      ).then(([_, data]) => {
        return data
      })

      return res.status(200).json({
        message: 'Sukses Ubah Invoice Footer',
        data: editInvoiceFooter?.dataValues
      })
    } else {
      return res.status(403).json({
        message: 'Invoice Footer Sudah Tersedia'
      })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}

// Delete Social Media Invoice By Id
exports.deleteInvoiceFooterById = async (req, res, next) => {
  const body = req.body

  try {
    const getId = await InvoiceFooter.destroy({
      where: {
        id: body.id,
        name: body.name,
        store: body.store
      },
      force: true
    })

    if (getId) {
      return res.status(200).json({
        message: 'Success Hapus Social Media Invoice'
      })
    } else {
      return res.status(403).json({
        message: 'Hapus Social Media Invoice Gagal'
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

// Activae / Not Activate Invoice By ID
exports.activateInvoiceFooterById = async (req, res, next) => {
  const body = req.body
  try {
    const getDuplicate = await InvoiceFooter.findOne({
      where: {
        name: body.name,
        store: body.store
      }
    })

    const getAllLogoNotById = await InvoiceFooter.findAll({
      where: {
        name: { [Op.notLike]: body.name }
      }
    }).then((items) => {
      return items.map((val) => val.id)
    })

    getAllLogoNotById.forEach(async (items) => {
      await InvoiceFooter.update(
        {
          isActive: false
        },
        {
          where: {
            id: items,
            store: body.store
          }
        }
      )
    })

    if (getDuplicate?.dataValues) {
      const editInvoiceFooter = await InvoiceFooter?.update(
        {
          name: body.name,
          isActive: body.isActive
        },
        {
          returning: true,
          where: {
            id: body.id,
            store: body.store
          }
        }
      ).then(([_, data]) => {
        return data
      })

      return res.status(200).json({
        message: 'Sukses Ubah Social Media Invoice',
        data: editInvoiceFooter?.dataValues
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
