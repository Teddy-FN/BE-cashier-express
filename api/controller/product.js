/* eslint-disable no-unsafe-finally */
/* eslint-disable no-unused-vars */
// Connect DB
const Product = require('../../db/models/product')
const Category = require('../../db/models/category')
const SubCategoryProduct = require('../../db/models/sub_category')
const { compareProduct } = require('../../utils/compare-value')
const { Op } = require('sequelize')
const excelJS = require('exceljs')
const fs = require('fs')
const { google } = require('googleapis')

const path = './files'
const CLIENT_ID =
  '1039712103717-fl89g0bcmekc2lqeajtdnp1ka11u0s6u.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN =
  '1//04J2pW5UoO4JOCgYIARAAGAQSNwF-L9IreIexo4pOeEPsEMjKXcyFDmPcoTL8pLWD8YCo0-wTfdSIGG2_MGSZDHLa8E3AIXDNpAg'

// Load Google API credentials
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)

// Set the credentials
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const folderId = '14amtGW104xLNqImWsJX1EC3c0atYAu_M' // Replace with your Google Drive folder ID

// Function to search for a file in Google Drive by name
const findFileByName = async (fileName) => {
  try {
    const response = await drive.files.list({
      q: `name='${fileName}' and '${folderId}' in parents`,
      fields: 'files(id, name)',
      spaces: 'drive'
    })
    return response.data.files[0] // Return the first matching file if found
  } catch (error) {
    throw new Error('Error searching for file on Google Drive')
  }
}

// Function to delete a file by its Google Drive file ID
const deleteFile = async (fileId) => {
  try {
    await drive.files.delete({ fileId })
  } catch (error) {
    throw new Error('Error deleting file from Google Drive')
  }
}

// Function to upload an image to Google Drive
const uploadImageToDrive = async (filePath, fileName) => {
  const accessTokenInfo = await oauth2Client.getAccessToken()

  if (!accessTokenInfo.token) {
    throw new Error('Failed to obtain access token')
  }

  if (!fs.existsSync(filePath)) {
    throw new Error('File not found')
  }

  const fileMetadata = {
    name: fileName,
    parents: [folderId]
  }

  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(filePath)
  }

  try {
    const { data: file } = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    })

    await drive.permissions.create({
      fileId: file.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    })

    return `https://drive.google.com/uc?id=${file.id}`
  } catch (error) {
    throw new Error('Failed to upload image')
  }
}

// Use the access token for the Drive API
const drive = google.drive({ version: 'v3', auth: oauth2Client })

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

    if (nameProduct) {
      filters.nameProduct = {
        [Op.like]: `${nameProduct}%`
      }
    }

    if (Number(category)) {
      filters.category = Number(category)
    }
    if (store) {
      filters.store = store
    }

    filters.status = true

    const getAllProduct = await Product.findAll({
      where: filters
    })

    // Fetch categories and resolve subcategories
    const resolvedSubCategories = await Promise.all(
      getAllProduct.map(async (items) => {
        const categoryData = await Category.findOne({
          where: {
            id: items.dataValues.category
          },
          returning: true
        })

        return {
          ...items.dataValues,
          nameCategory: categoryData ? categoryData.value : null
        }
      })
    )

    // Resolve subcategory options for each product
    const dataNewFormat = await Promise.all(
      resolvedSubCategories.map(async (items) => {
        const resolvedOptions = await Promise.all(
          items.option.map(async (val) => {
            const categoryData = await SubCategoryProduct.findOne({
              where: {
                id: val
              },
              returning: true
            })

            return categoryData
              ? {
                  isMultiple: categoryData.isMultiple,
                  nameSubCategory: categoryData.nameSubCategory,
                  typeSubCategory: categoryData.typeSubCategory
                }
              : null
          })
        )

        return {
          ...items,
          option: resolvedOptions
        }
      })
    )

    const responseData = dataNewFormat.map((items) => {
      return {
        ...items
      }
    })

    console.log('responseData =>', responseData)

    return res.status(200).json({
      message: 'Success',
      data: responseData.length > 0 ? responseData : []
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
  const { store, page = 1, pageSize = 10, status = 'all' } = req.query // Default page = 1, pageSize = 10, status = 'all'

  try {
    const offset = (page - 1) * pageSize // Calculate the offset for pagination

    // Build the where condition based on the status filter
    let statusCondition = {}
    if (status === 'true') {
      statusCondition = { status: true }
    } else if (status === 'false') {
      statusCondition = { status: false }
    }

    // Combine store and status filter
    const whereCondition = {
      store: store,
      ...statusCondition // Add the status condition if applicable
    }

    // Fetch products with pagination and status filter
    const getAllProduct = await Product.findAll({
      where: whereCondition,
      limit: parseInt(pageSize), // Limit number of products per page
      offset: parseInt(offset) // Offset based on the current page
    })

    console.log('getAllProduct =>', getAllProduct)

    // Fetch categories and resolve subcategories
    const resolvedSubCategories = await Promise.all(
      getAllProduct.map(async (items) => {
        const categoryData = await Category.findOne({
          where: {
            id: items.dataValues.category
          }
        })

        return {
          ...items.dataValues,
          nameCategory: categoryData ? categoryData.name : null
        }
      })
    )

    // Resolve subcategory options for each product
    const dataNewFormat = await Promise.all(
      resolvedSubCategories.map(async (items) => {
        const resolvedOptions = await Promise.all(
          items.option.map(async (val) => {
            const categoryData = await SubCategoryProduct.findOne({
              where: {
                id: val
              }
            })

            return categoryData
              ? {
                  id: categoryData.id,
                  name: categoryData.nameSubCategory,
                  option: JSON.parse(categoryData.typeSubCategory),
                  isMultiple: categoryData.isMultiple
                }
              : null
          })
        )

        return {
          ...items,
          option: resolvedOptions
        }
      })
    )

    const responseData = dataNewFormat.map((items) => {
      return {
        ...items
      }
    })

    console.log('responseData =>', responseData)

    // Get the total count of products for pagination, considering the status filter
    const totalProducts = await Product.count({
      where: whereCondition
    })

    return res.status(200).json({
      message: 'Success',
      data: responseData.length > 0 ? responseData : [],
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        totalItems: totalProducts, // Total number of products
        totalPages: Math.ceil(totalProducts / pageSize) // Total pages
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

// Function Post Add Form Product
exports.postAddProduct = async (req, res, next) => {
  console.log('req.body =>', req.body)
  const {
    nameProduct,
    category,
    status,
    description,
    price,
    createdBy,
    image,
    option,
    isOption,
    store
  } = req.body

  try {
    // Check if a product with the same name exists in the store
    const existingProduct = await Product.findOne({
      where: {
        store,
        nameProduct
      }
    })

    if (existingProduct) {
      return res.status(400).json({
        message: 'Product with this name already exists in the store.'
      })
    }

    const imageFile = req.file
    let imageUrl = null

    if (imageFile) {
      // Check if a file with the same name exists on Google Drive
      const existingFile = await findFileByName(imageFile.originalname)

      // If file exists, delete the old image from Google Drive
      if (existingFile) {
        await deleteFile(existingFile.id)
      }

      // Upload the new image to Google Drive and get the URL
      imageUrl = await uploadImageToDrive(
        imageFile.path,
        imageFile.originalname
      )
    }

    const optionsArray =
      isOption === 'true' && typeof option === 'string'
        ? option.split(',').map((opt) => {
            const numOpt = Number(opt)
            console.log(`Converted ${opt} to ${numOpt}`)
            return numOpt
          })
        : []

    // Create new product
    const postData = await Product.create({
      nameProduct,
      category,
      description,
      price,
      status,
      isOption,
      option: optionsArray, // Ensure it's an array
      createdBy,
      image: imageUrl || image, // Use the uploaded image URL or fallback to provided image
      store
    })

    return res.status(200).json({
      status: 'success',
      data: postData
    })
  } catch (error) {
    console.error('Error =>', error)
    return res.status(500).json({
      error: 'Internal Server Error'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}

// Render Edit Form Product
exports.editProductByLocationAndId = async (req, res, next) => {
  const {
    id,
    nameProduct,
    category,
    status,
    description,
    price,
    image: newImage,
    option,
    isOption,
    store
  } = req.body

  console.log('req.body =>', req.body)

  try {
    const getAllProductByIdAndLocation = await Product.findOne({
      where: {
        id: id,
        store: store
      }
    })

    if (!getAllProductByIdAndLocation) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    const oldImage = getAllProductByIdAndLocation.image
    let imageUrl = oldImage

    if (req.file) {
      if (newImage && oldImage !== newImage) {
        const oldImageFileId = oldImage.split('id=')[1].split('&')[0]
        await drive.files.delete({ fileId: oldImageFileId })

        imageUrl = await uploadImageToDrive(
          req.file.path,
          req.file.originalname
        )
      }
    }

    const optionsArray =
      isOption === 'true' && typeof option === 'string'
        ? option.split(',').map((opt) => {
            const numOpt = Number(opt)
            console.log(`Converted ${opt} to ${numOpt}`)
            return numOpt
          })
        : []

    const reqBody = {
      nameProduct,
      image: imageUrl,
      category,
      description,
      price,
      isOption,
      option: optionsArray, // Ensure it's an array
      status,
      store
    }

    const duplicateData = {
      nameProduct: getAllProductByIdAndLocation.nameProduct,
      image: imageUrl,
      category: getAllProductByIdAndLocation.category,
      description: getAllProductByIdAndLocation.description,
      price: getAllProductByIdAndLocation.price,
      isOption: getAllProductByIdAndLocation.isOption,
      option: getAllProductByIdAndLocation.option,
      status: getAllProductByIdAndLocation.status,
      store: getAllProductByIdAndLocation.store
    }

    const result = compareProduct(reqBody, duplicateData)

    if (!result) {
      const [_, editLocation] = await Product.update(reqBody, {
        returning: true,
        where: {
          id: id
        }
      })

      return res.status(200).json({
        message: 'Sukses Ubah Product',
        data: editLocation?.dataValues
      })
    } else {
      return res.status(403).json({
        message: 'Product Sudah Terdaftar'
      })
    }
  } catch (error) {
    console.error('ERROR =>', error)
    return res.status(500).json({
      error: 'Terjadi Kesalahan Internal Server'
    })
  } finally {
    console.log('resEND')
    return res.end()
  }
}

exports.deleteProductByIdAndLocation = async (req, res, next) => {
  const { id, nameProduct, store } = req.body
  try {
    const getId = await Product.destroy({
      where: {
        id: id,
        nameProduct: nameProduct,
        store: store
      },
      force: true
    })

    if (getId) {
      return res.status(200).json({
        message: 'Success Hapus Product'
      })
    } else {
      return res.status(403).json({
        message: 'Hapus Product Gagal'
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

// Download Excel Template By Excel with dropdown list of categories by storeId
exports.exportProduct = async (req, res) => {
  const { storeId } = req.params // Get storeId from the request parameters

  // Create new workbook and worksheet
  const workbook = new excelJS.Workbook()
  const worksheet = workbook.addWorksheet('Product')

  // Ensure the download path exists
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }

  // Define columns for the worksheet
  worksheet.columns = [
    { header: 'No.', key: 's_no', width: 10 },
    { header: 'Name Product', key: 'nameProduct', width: 20 },
    { header: 'Image', key: 'image', width: 20 },
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Description', key: 'description', width: 20 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Price', key: 'price', width: 20 }
  ]

  // Make the header row bold
  worksheet.getRow(1).font = { bold: true }

  try {
    // Fetch categories filtered by storeId
    const categories = await Category.findAll({
      where: { storeId },
      attributes: ['name'] // Only select the 'name' field
    })

    if (!categories.length) {
      return res
        .status(404)
        .json({ message: 'No categories found for this store' })
    }

    // Prepare the category names for the dropdown list
    const categoryList = categories.map((cat) => cat.name).join(',')

    // Set data validation (dropdown list) for the 'Category' column (B2 onward)
    worksheet.getCell('F2').dataValidation = {
      type: 'list',
      allowBlank: true,
      formula1: `"${categoryList}"`, // Excel requires the list to be in double quotes
      showDropDown: true
    }

    // Generate the Excel file in memory (buffer)
    const buffer = await workbook.xlsx.writeBuffer()

    // Set headers and send the Excel file as a response
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=product_template.xlsx'
    )

    res.send(buffer)
  } catch (err) {
    console.error('Error exporting product Excel file: ', err)
    res.status(500).send({
      status: 'error',
      message: 'Something went wrong while generating the Excel file',
      error: err.message
    })
  }
}
