import Product from "../model/product.model.js";

export const createProduct = async (req, res) => {

    try {

        const { name, description, price } = req.body;

        if (!name || !description || !price) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const product = await Product.create({
            name,
            description,
            price,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });

    } catch (error) {

        console.error("Create product error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });

    }

}


export const getTotalProducts = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;


        const products = await Product.find({})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (!products) {
            return res.status(404).json({
                message: "tha data is not found in the products"
            })
        }

        const totalProducts = await Product.countDocuments();

        const totalPages = Math.ceil(totalProducts / limit);

        return res.status(200).json({

            success: true,

            message: "this is total product data",

            pagination: {
                currentPage: page,
                limit,
                totalPages,
                totalProducts
            },

            products

        })

    } catch (error) {

        console.error("Create product error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });


    }
}