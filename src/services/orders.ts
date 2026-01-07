import prisma from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
import { Order, OrderCreate, OrderItem } from "@/types/order";
import { createdBy } from "@/types/user";
import { Prisma } from "@prisma/client";
import { getCustomer } from "./customers";
import { getProduct } from "./products";

const includeRelations = {
    include: {
        customer: true,
        orderItems: {
            include: {
                product: true,
            },
        },
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

type OrderWithRelations = Prisma.OrderGetPayload<typeof includeRelations>;

const transformOrder = (rawOrder: OrderWithRelations): Order => {
    const order: Order = {
        id: rawOrder.id,
        customer:{
            id: rawOrder.customer.id,
            name: rawOrder.customer.name,
            email: rawOrder.customer.email,
            address: rawOrder.customer.address,
            city: rawOrder.customer.city,
            country: rawOrder.customer.country || undefined,
            phone: rawOrder.customer.phone,
        },
        total: rawOrder.total,
        createdAt: rawOrder.createdAt.toISOString(),
        orderItems: rawOrder.orderItems.map(item => ({
            id: item.id,
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price,
        })),
    };
    
    return order;
};

export interface OrderQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'id' | 'total' | 'createdAt' | 'state';
    sortOrder?: 'asc' | 'desc';
    customerId?: number;
    state?: string;
}

export interface PaginatedOrders {
    data: Order[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const getAllOrders = async (params: OrderQueryParams = {}): Promise<PaginatedOrders> => {
    const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        customerId,
        state
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {
        archived: false,
    };
    
    if (search) {
        where.OR = [
            { 
                customer: {
                    OR: [
                        { name: { contains: search } },
                        { email: { contains: search} },
                    ]
                }
            },
            { id: isNaN(Number(search)) ? undefined : Number(search) }
        ].filter(Boolean);
    }

    if (customerId) {
        where.customerId = customerId;
    }

    if (state) {
        where.state = state;
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            ...includeRelations,
            orderBy: {
                [sortBy]: sortOrder,
            },
        }),
        prisma.order.count({ where }),
    ]);

    return {
        data: orders.map(transformOrder),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getOrder = async (id: number): Promise<Order> => {
    const order = await prisma.order.findUnique({
        where: { id },
        ...includeRelations,
    });
    
    if (!order || order.archived) {
        throw new ValidationError(1003, 404, "Order not found");
    }
    
    return transformOrder(order);
};

export const createOrder = async (orderData: { customerId: number; orderItems: OrderItem[] }, userId: number): Promise<Order> => {
    // Validate required fields
    if (!orderData.customerId || !orderData.orderItems || orderData.orderItems.length === 0) {
        throw new ValidationError(1003, 400, "Customer ID and order items are required");
    }

    // Check if customer exists
    await getCustomer(orderData.customerId);

    // Validate and prepare order items
    const validatedItems = await Promise.all(
        orderData.orderItems.map(async (item) => {
            if (!item.productId || !item.quantity) {
                throw new ValidationError(1003, 400, "Product ID and quantity are required for each item");
            }

            if (item.quantity <= 0) {
                throw new ValidationError(1003, 400, "Quantity must be greater than 0");
            }

            const product = await getProduct(item.productId);
            
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        })
    );

    // Calculate total
    const total = validatedItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    // Create order with transaction
    const newOrder = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                customerId: orderData.customerId,
                total,
                createdById: userId,
                orderItems: {
                    create: validatedItems,
                },
            },
            ...includeRelations,
        });

        return order;
    });

    return transformOrder(newOrder);
};

export const updateOrder = async (id: number, orderData: { orderItems?: OrderItem[]; state?: string }, userId: number): Promise<Order> => {
    // Check if order exists
    const existingOrder = await getOrder(id);

    // If updating order items, validate and recalculate total
    if (orderData.orderItems && orderData.orderItems.length > 0) {
        const validatedItems = await Promise.all(
            orderData.orderItems.map(async (item) => {
                if (!item.productId || !item.quantity) {
                    throw new ValidationError(1003, 400, "Product ID and quantity are required for each item");
                }

                if (item.quantity <= 0) {
                    throw new ValidationError(1003, 400, "Quantity must be greater than 0");
                }

                const product = await getProduct(item.productId);
                
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                };
            })
        );

        // Calculate new total
        const total = validatedItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        // Update order with transaction
        const updatedOrder = await prisma.$transaction(async (tx) => {
            // Delete existing order items
            await tx.orderItem.deleteMany({
                where: { orderId: id },
            });

            // Update order with new items
            const order = await tx.order.update({
                where: { id },
                data: {
                    total,
                    state: orderData.state,
                    updatedById: userId,
                    orderItems: {
                        create: validatedItems,
                    },
                },
                ...includeRelations,
            });

            return order;
        });

        return transformOrder(updatedOrder);
    } else {
        // Just update state if provided
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                state: orderData.state,
                updatedById: userId,
            },
            ...includeRelations,
        });

        return transformOrder(updatedOrder);
    }
};

export const deleteOrder = async (id: number, userId: number): Promise<void> => {
    // Check if order exists
    const order = await prisma.order.findUnique({
        where: { id },
    });

    if (!order) {
        throw new ValidationError(1003, 404, "Order not found");
    }

    // Permanently delete order and its items in a transaction
    await prisma.$transaction(async (tx) => {
        // First, delete all OrderItems belonging to this order
        await tx.orderItem.deleteMany({
            where: { orderId: id },
        });

        // Then, delete the order
        await tx.order.delete({
            where: { id },
        });
    });
};

export const getOrdersByCustomer = async (customerId: number): Promise<Order[]> => {
    const orders = await prisma.order.findMany({
        where: {
            customerId,
            archived: false,
        },
        ...includeRelations,
        orderBy: {
            createdAt: "desc",
        },
    });

    return orders.map(transformOrder);
};

export const cancelOrder = async (id: number, userId: number): Promise<Order> => {
    const order = await prisma.order.update({
        where: { id },
        data: {
            state: "CANCELLED",
            cancelledAt: new Date(),
            updatedById: userId,
        },
        ...includeRelations,
    });

    return transformOrder(order);
};

export const restoreOrder = async (id: number, userId: number): Promise<Order> => {
    // Check if order exists (including archived)
    const order = await prisma.order.findUnique({
        where: { id },
    });
    
    if (!order) {
        throw new ValidationError(1003, 404, "Order not found");
    }
    
    if (!order.archived) {
        throw new ValidationError(1003, 400, "Order is not archived");
    }
    
    // Restore the order
    const restoredOrder = await prisma.order.update({
        where: { id },
        data: {
            archived: false,
            archivedAt: null,
            updatedById: userId,
        },
        ...includeRelations,
    });
    
    return transformOrder(restoredOrder);
};