/* eslint-disable no-unused-vars */
const SubCategoryProduct = require('../../db/models/sub_category')

// Get All Sub-category
exports.getAllSubCategory = async (req, res, next) => {
  try {
    const subCategory = await SubCategoryProduct.findAll()

    return res.status(200).json({
      message: 'Success',
      data:
        subCategory?.length > 0
          ? subCategory?.map((items) => {
              return {
                ...items?.dataValues,
                typeSubCategory: JSON?.parse(items?.dataValues?.typeSubCategory)
              }
            })
          : []
    })
  } catch (error) {
    console.log('Error =>', error)
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  }
}

// Post New SUb Category
exports.postNewSubCategory = async (req, res, next) => {
  try {
    const {
      parentCategory,
      nameSubCategory,
      typeSubCategory,
      isMultiple,
      createdBy
    } = req.body

    const postData = await SubCategoryProduct.create({
      parentCategory: parentCategory,
      nameSubCategory: nameSubCategory,
      typeSubCategory: typeSubCategory,
      isMultiple: isMultiple,
      createdBy: createdBy
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
  }
}

exports.getSubcategoryById = async (req, res, next) => {}

// Edit Sub Category By ID
exports.editSubcategoryById = async (req, res, next) => {
  try {
    const {
      id,
      parentCategory,
      nameSubCategory,
      typeSubCategory,
      isMultiple,
      createdBy,
      modifiedBy
    } = req.body

    const editSubCategory = await SubCategoryProduct?.update(
      {
        parentCategory: parentCategory,
        nameSubCategory: nameSubCategory,
        typeSubCategory: typeSubCategory,
        isMultiple: isMultiple,
        createdBy: createdBy,
        modifiedBy: modifiedBy
      },
      {
        returning: true,
        where: {
          id: id
        }
      }
    ).then(([_, data]) => {
      return data
    })

    return res.status(200).json({
      message: 'Sukses Ubah Sub Category',
      data: editSubCategory?.dataValues
    })
  } catch (error) {
    console.log('Error =>', error)
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  }
}

exports.deleteSubcategoryById = async (req, res, next) => {
  const body = req.body

  try {
    const getId = await SubCategoryProduct.destroy({
      where: {
        id: body.id,
        parentCategory: body.parentCategory
      },
      force: true
    })

    if (getId) {
      return res.status(200).json({
        message: 'Success Hapus Sub Category'
      })
    } else {
      return res.status(403).json({
        message: 'Hapus Category Gagal'
      })
    }
  } catch (error) {
    console.log('ERROR =>', error)
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  }
}
