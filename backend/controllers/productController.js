import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body

        let imagesUrl = []

        // Extract uploaded files from req.files
        const files = req.files || {}
        const image1 = files.image1 && files.image1[0]
        const image2 = files.image2 && files.image2[0]
        const image3 = files.image3 && files.image3[0]
        const image4 = files.image4 && files.image4[0]
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        // Check if Cloudinary credentials exist
        const hasCloudinary = process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_SECRET_KEY && process.env.CLOUDINARY_NAME

        if (images.length > 0) {
            if (hasCloudinary) {
                imagesUrl = await Promise.all(
                    images.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                        return result.secure_url
                    })
                )
            } else {
                // Use local upload URLs
                imagesUrl = images.map((item) => `/uploads/${item.filename}`)
            }
        }

        if (imagesUrl.length === 0) {
            imagesUrl = ["https://via.placeholder.com/400x500?text=No+Image"]
        }

        let parsedSizes = []
        if (typeof sizes === 'string') {
            try {
                parsedSizes = JSON.parse(sizes)
            } catch (e) {
                parsedSizes = sizes.split(',').map(s => s.trim())
            }
        } else if (Array.isArray(sizes)) {
            parsedSizes = sizes
        }

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestSeller: bestSeller === "true" || bestSeller === true,
            sizes: parsedSizes,
            image: imagesUrl,
            date: Date.now()
        }

        const product = new productModel(productData)
        await product.save()

        res.json({ success: true, message: "Product Added Successfully", product })

    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed Successfully" })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }
        res.json({ success: true, product })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }

