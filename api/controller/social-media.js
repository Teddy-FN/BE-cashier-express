/* eslint-disable no-unsafe-finally */
/* eslint-disable no-unused-vars */
const SocialMedia = require('../../db/models/social_media')

// Get All List To Cashier List
exports.getAllSocialMedia = async (req, res, next) => {
  const { store, page = 1, size = 10 } = req.query // Default page = 1, size = 10
  const limit = parseInt(size)
  const offset = (parseInt(page) - 1) * limit

  try {
    const { count, rows: getAllCategory } = await SocialMedia.findAndCountAll({
      where: {
        store: store
      },
      limit: limit,
      offset: offset
    })

    return res.status(200).json({
      message: 'Success',
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: getAllCategory?.length > 0 ? getAllCategory : []
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}

// Add New Social Media
exports.addNewSocialMedia = async (req, res, next) => {
  const body = req.body

  try {
    const findOneSocialMedia = await SocialMedia?.findOne({
      where: {
        name: body?.name,
        store: body.store
      }
    })

    if (!findOneSocialMedia?.getDataValue) {
      const creadtedCategory = await SocialMedia.create({
        name: body.name,
        createdBy: body.createdBy,
        store: body.store
      })

      if (creadtedCategory.getDataValue) {
        return res.status(200).json({
          message: 'Social Media Berhasil Di Buat'
        })
      }
    } else {
      return res.status(403).json({
        message: 'Social Media Sudah Terdaftar'
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

// Edit Socia Media By Id
exports.editSocialMediaById = async (req, res, next) => {
  const body = req.body
  try {
    const getDuplicate = await SocialMedia.findOne({
      where: {
        name: body.name,
        store: body.store
      }
    })

    if (!getDuplicate?.dataValues) {
      const editCategory = await SocialMedia?.update(
        {
          id: body?.id,
          name: body?.name
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
        message: 'Sukses Ubah Social Media',
        data: editCategory?.dataValues
      })
    } else {
      return res.status(403).json({
        message: 'Social Media Sudah Tersedia'
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

// Delete Socia Media By Id
exports.deleteSocialMediaById = async (req, res, next) => {
  const body = req.body

  try {
    const getId = await SocialMedia.destroy({
      where: {
        id: body.id,
        name: body.name,
        store: body.store
      },
      force: true
    })

    if (getId) {
      return res.status(200).json({
        message: 'Success Hapus Social Media'
      })
    } else {
      return res.status(403).json({
        message: 'Gagal Hapus Social Media'
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
