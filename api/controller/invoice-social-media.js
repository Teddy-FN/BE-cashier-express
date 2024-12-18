/* eslint-disable no-unsafe-finally */
/* eslint-disable no-unused-vars */
const InvoiceSocialMedia = require('../../db/models/invoice_social_media')
const { Op } = require('sequelize')

// Get Logo Using To Invoice
exports.getInvoiceSocialMediaByLocation = async (req, res, next) => {
  const { store } = req.query
  try {
    const invoiceSocialMedia = await InvoiceSocialMedia.findAll({
      where: {
        store: store,
        isActive: true
      }
    })
    return res.status(200).json({
      message: 'Success',
      data:
        invoiceSocialMedia?.length > 0
          ? invoiceSocialMedia?.map((items) => {
              return {
                ...items?.dataValues,
                socialMediaList: JSON?.parse(items?.dataValues?.socialMediaList)
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
exports.getInvoiceSocialMediaByIsActive = async (req, res, next) => {
  const { store } = req.query
  try {
    const invoiceSocialMedia = await InvoiceSocialMedia.findAll({
      where: {
        isActive: true,
        store: store
      }
    })
    return res.status(200).json({
      message: 'Success',
      data:
        invoiceSocialMedia?.length > 0
          ? invoiceSocialMedia?.map((items) => {
              return {
                ...items?.dataValues,
                socialMediaList: JSON?.parse(items?.dataValues?.socialMediaList)
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
exports.getAllInvoiceSocialMedia = async (req, res, next) => {
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
    const { count, rows: socialMedia } =
      await InvoiceSocialMedia.findAndCountAll({
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
        socialMedia?.length > 0
          ? socialMedia?.map((items) => {
              return {
                ...items?.dataValues,
                socialMediaList: JSON?.parse(items?.dataValues?.socialMediaList)
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
exports.postNewInvoiceSocialMedia = async (req, res, next) => {
  const { name, socialMediaList, isActive, status, createdBy, store } = req.body
  try {
    const findOneInvoiceSocialMedia = await InvoiceSocialMedia?.findOne({
      where: {
        name: name,
        store: store
      }
    })

    if (!findOneInvoiceSocialMedia?.getDataValue) {
      const postData = await InvoiceSocialMedia.create({
        name: name,
        socialMediaList: socialMediaList,
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
        message: 'Template Name Invoice Social Media Sudah Tersedia'
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

// Edit InvoiceSocialMedia By Id
exports.editInvoiceSocialMediaById = async (req, res, next) => {
  const body = req.body
  try {
    const getDuplicate = await InvoiceSocialMedia.findOne({
      where: {
        name: body.name,
        store: body.store
      }
    })

    const bodySocialMediaList = JSON.parse(body.socialMediaList)
    const duplicateSocialMediaList = JSON.parse(
      getDuplicate.dataValues.socialMediaList
    )

    if (
      !getDuplicate?.dataValues ||
      !getDuplicate?.dataValues?.status === body?.status ||
      bodySocialMediaList.length !== duplicateSocialMediaList.length
    ) {
      const editInvoiceSocialMedia = await InvoiceSocialMedia?.update(
        {
          name: body.name,
          socialMediaList: body.socialMediaList,
          createdBy: body.createdBy,
          modifiedBy: body?.modifiedBy,
          status: body.status,
          isActive: false
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
        message: 'Sukses Ubah Invoice Social Media',
        data: editInvoiceSocialMedia?.dataValues
      })
    } else {
      return res.status(403).json({
        message: 'Invoice Social Media Sudah Tersedia'
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
exports.deleteInvoiceSocialMediaById = async (req, res, next) => {
  const body = req.body

  try {
    const getId = await InvoiceSocialMedia.destroy({
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
exports.activateInvoiceSocialMediaById = async (req, res, next) => {
  const body = req.body
  try {
    const getDuplicate = await InvoiceSocialMedia.findOne({
      where: {
        name: body.name
      }
    })

    const getAllLogoNotById = await InvoiceSocialMedia.findAll({
      where: {
        name: { [Op.notLike]: body.name }
      }
    }).then((items) => {
      return items.map((val) => val.id)
    })

    getAllLogoNotById.forEach(async (items) => {
      await InvoiceSocialMedia.update(
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
      const editInvoiceSocialMedia = await InvoiceSocialMedia?.update(
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
        data: editInvoiceSocialMedia?.dataValues
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
