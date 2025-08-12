import { ValidationError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { Product } from "@/types/products";
import { createdBy } from "@/types/user";
import { Prisma } from "@prisma/client";

const includeCreatedBy = {
    include: {
        createdBy: {
            select: {
                id: true,
                username: true,
                email: true,

            },
        },
        updatedBy: {
            select: {
                id: true,
                username: true,
                email: true,
            },
        },
    },
};


type ProductWithCreatedBy = Prisma.ProductGetPayload<typeof includeCreatedBy>;

const transformProduct = (anyRawDBData: ProductWithCreatedBy) => {
    const product = {
        id: anyRawDBData.id,
        name: anyRawDBData.name,
        description: anyRawDBData.description,
        price: anyRawDBData.price,
        updatedAt: anyRawDBData.updatedAt,
        createdAt: anyRawDBData.createdAt,  
        createdBy: anyRawDBData.createdById ? anyRawDBData.createdBy as createdBy : undefined,
        updatedBy: anyRawDBData.updatedById ? anyRawDBData.updatedBy as createdBy : undefined,

    };
    return product as Product;
}

export interface ProductQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
}

export interface PaginatedProducts {
    data: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const getProducts = async (params: ProductQueryParams = {}): Promise<PaginatedProducts> => {
    const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        minPrice,
        maxPrice
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {
        archived: false,
    };
    
    if (search) {
        where.OR = [
            { name: { contains: search } },
            { description: { contains: search } },
        ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) {
            where.price.gte = minPrice;
        }
        if (maxPrice !== undefined) {
            where.price.lte = maxPrice;
        }
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            ...includeCreatedBy,
            orderBy: {
                [sortBy]: sortOrder,
            },
        }),
        prisma.product.count({ where }),
    ]);

    return {
        data: products.map(transformProduct),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export const getProduct = async (id: number): Promise<Product> => {
    const product = await prisma.product.findUnique({
        where: { id },
        ...includeCreatedBy,
    });
    if (!product || product.archived) {
        throw new ValidationError(1004, 404, "Product not found");
    }
    return transformProduct(product);
}

export const createProduct = async (product: Product, userId: number): Promise<Product> => {

    if (!product.name || !product.price) {
        throw new ValidationError(1004, 404, "Product name and price are required");
    }

    //check if product name is already in use
    const existingProduct = await prisma.product.findFirst({
        where: { 
            name: product.name,
            archived: false,
        },
    });

    if (existingProduct) {
        throw new ValidationError(1004, 404, "Product name already in use");
    }

    //check if product price is a number
    if (isNaN(product.price)) {
        throw new ValidationError(1004, 404, "Product price must be a number");
    }

    //check if product price is greater than 0
    if (product.price <= 0) {
        throw new ValidationError(1004, 404, "Product price must be greater than 0");
    }

    const newProduct = await prisma.product.create({
        data: {
            name: product.name,
            description: product.description,
            price: product.price,
            createdBy: {
                connect: {
                    id: userId,
                },
            },
        },
        ...includeCreatedBy,
    });
    return transformProduct(newProduct);
}

export const updateProduct = async (id: number, productUpdate: Product, userId: number): Promise<Product> => {
    //check if product exists
    const existingProduct = await getProduct(id);


    //check if product name is already in use, but not the same product
    const existingProductName = await prisma.product.findFirst({
        where: {
            name: productUpdate.name,
            archived: false,
            NOT: { id: existingProduct.id }
        },
    });

    if (existingProductName) {
        throw new ValidationError(1004, 404, "Product name already in use");
    }

    //check if product price is a number
    if (isNaN(productUpdate.price)) {
        throw new ValidationError(1004, 404, "Product price must be a number");
    }

    //check if product price is greater than 0
    if (productUpdate.price <= 0) {
        throw new ValidationError(1004, 404, "Product price must be greater than 0");
    }


    const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
            name: productUpdate.name,
            description: productUpdate.description,
            price: productUpdate.price,
            updatedAt: new Date(),
            updatedBy: {
                connect: {
                    id: userId,
                },
            },
        },
        ...includeCreatedBy,
    });

    return transformProduct(updatedProduct);

}

export const deleteProduct = async (id: number, userId: number): Promise<void> => {
    //check if product exists
    const existingProduct = await getProduct(id);
    //don't allow deletion of product, but soft delete it    
    await prisma.product.update({
        where: { id },
        data: {
            archived: true,
            archivedAt: new Date(),
            updatedAt: new Date(),
            updatedBy: {
                connect: {
                    id: userId,
                },
            },

        },
    });
}

export const restoreProduct = async (id: number, userId: number): Promise<Product> => {
    // Check if product exists (including archived)
    const product = await prisma.product.findUnique({
        where: { id },
    });
    
    if (!product) {
        throw new ValidationError(1004, 404, "Product not found");
    }
    
    if (!product.archived) {
        throw new ValidationError(1004, 400, "Product is not archived");
    }
    
    // Check if a product with the same name is already active
    const existingActiveProduct = await prisma.product.findFirst({
        where: {
            name: product.name,
            archived: false,
        },
    });
    
    if (existingActiveProduct) {
        throw new ValidationError(1004, 409, `Cannot restore product. A product with name "${product.name}" already exists`);
    }
    
    // Restore the product
    const restoredProduct = await prisma.product.update({
        where: { id },
        data: {
            archived: false,
            archivedAt: null,
            updatedAt: new Date(),
            updatedBy: {
                connect: {
                    id: userId,
                },
            },
        },
        ...includeCreatedBy,
    });
    
    return transformProduct(restoredProduct);
}




