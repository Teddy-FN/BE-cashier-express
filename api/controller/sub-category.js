/* eslint-disable no-unsafe-finally */
/* eslint-disable no-unused-vars */
const SubCategoryProduct = require('../../db/models/sub_category')
const Category = require('../../db/models/category')

// Get All Sub-category
exports.getAllSubCategory = async (req, res, next) => {
  const { store, page = 1, pageSize = 10 } = req.query // Default values: page = 1, pageSize = 10

  try {
    const offset = (page - 1) * pageSize // Calculate offset for pagination

    // Fetch sub-categories with pagination
    const subCategory = await SubCategoryProduct.findAll({
      where: {
        store: store
      },
      limit: parseInt(pageSize), // Limit the number of results per page
      offset: parseInt(offset) // Offset based on the current page
    })

    // Fetch associated category data for each sub-category
    const resolvedSubCategories = await Promise.all(
      subCategory.map(async (items) => {
        const categoryData = await Category.findOne({
          where: {
            id: items.dataValues.idParentCategory
          }
        })

        return {
          ...items.dataValues,
          nameCategory: categoryData ? categoryData.name : null
        }
      })
    )

    // Parse JSON fields (if necessary) and construct the final response data
    const responseData = resolvedSubCategories.map((items) => {
      return {
        ...items,
        typeSubCategory: JSON?.parse(items?.typeSubCategory)
      }
    })

    // Get the total count of sub-categories for the store
    const totalSubCategories = await SubCategoryProduct.count({
      where: { store: store }
    })

    // Return the paginated response
    return res.status(200).json({
      message: 'Success',
      data: responseData.length > 0 ? responseData : [],
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        totalItems: totalSubCategories, // Total number of sub-categories
        totalPages: Math.ceil(totalSubCategories / pageSize) // Total pages
      }
    })
  } catch (error) {
    console.log('Error =>', error)
    return res.status(500).json({
      error: 'Internal Server Error'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}

// Post New SUb Category
exports.postNewSubCategory = async (req, res, next) => {
  const {
    parentCategory,
    nameSubCategory,
    typeSubCategory,
    isMultiple,
    store,
    createdBy
  } = req.body
  try {
    const postData = SubCategoryProduct.create({
      idParentCategory: parentCategory,
      nameSubCategory: nameSubCategory,
      typeSubCategory: typeSubCategory,
      isMultiple: isMultiple,
      store: store,
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
  } finally {
    console.log('resEND')
    return res.end()
  }
}

// Get All Sub-category By Category
exports.getSubcategoryByCategory = async (req, res, next) => {
  const { idParentCategory, store } = req.query
  try {
    const getSubAllCategory = await SubCategoryProduct.findAll({
      where: { idParentCategory: idParentCategory, store: store }
    })

    return res.status(200).json({
      status: 'success',
      data: getSubAllCategory.map((items) => ({ ...items.dataValues }))
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

// Edit Sub Category By ID
exports.editSubcategoryById = async (req, res, next) => {
  const {
    id,
    parentCategory,
    nameSubCategory,
    typeSubCategory,
    isMultiple,
    store,
    createdBy,
    modifiedBy
  } = req.body
  try {
    const editSubCategory = await SubCategoryProduct?.update(
      {
        idParentCategory: parentCategory,
        nameSubCategory: nameSubCategory,
        typeSubCategory: typeSubCategory,
        isMultiple: isMultiple,
        createdBy: createdBy,
        modifiedBy: modifiedBy
      },
      {
        returning: true,
        where: {
          id: id,
          store: store
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
  } finally {
    console.log('resEND')
    return res.end()
  }
}

exports.deleteSubcategoryById = async (req, res, next) => {
  const body = req.body

  try {
    const getId = await SubCategoryProduct.destroy({
      where: {
        id: body.id,
        store: body.store
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
  } finally {
    console.log('resEND')
    return res.end()
  }
}
