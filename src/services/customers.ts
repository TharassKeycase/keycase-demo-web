import { Customer, CustomerCreate } from "@/types/customer";
import prisma from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";

const getCustomerResponse = (rawData: any): Customer => {
    const customer = rawData as Customer;
    return {
        ...customer,
        createdAt: customer.createdAt ? new Date(customer.createdAt).toISOString() : "",
        updatedAt: customer.updatedAt ? new Date(customer.updatedAt).toISOString() : "",
    }
}

export interface CustomerQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedCustomers {
    data: Customer[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const getCustomers = async (params: CustomerQueryParams = {}): Promise<PaginatedCustomers> => {
    const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {
        archived: false,
    };
    
    if (search) {
        where.OR = [
            { name: { contains: search } },
            { email: { contains: search } },
            { city: { contains: search } },
            { address: { contains: search } },
        ];
    }

    const [customers, total] = await Promise.all([
        prisma.customer.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
        }),
        prisma.customer.count({ where }),
    ]);

    return {
        data: customers.map(getCustomerResponse),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

//the archived customers are not returned
export const getCustomer = async (id: number): Promise<Customer> => {
    const customer = await prisma.customer.findUnique({
        where: {
            id,
            archived: false,
        },
    });
    if (!customer) {
        throw new ValidationError(1004, 404, "Customer not found");
    }
    return getCustomerResponse(customer);
}

export const createCustomer = async (customer: CustomerCreate): Promise<Customer> => {
    //validation customer minimal fields 
    if (!customer.name || !customer.email || !customer.address || !customer.city) {
        throw new ValidationError(1001, 400, "Customer minimal fields are required");
    }
    //check if customer already exists
    const existingCustomer = await prisma.customer.findFirst({
        where: { email: customer.email },
    });

    if (existingCustomer) {
        throw new ValidationError(1002, 400, `Customer with email '${customer.email}' already exists`);
    }

    const newCustomer = await prisma.customer.create({
        data: {
            ...customer,
            phone: customer.phone ?? "",
        },
    });
    return getCustomerResponse(newCustomer);
}

export const updateCustomer = async (id: number, customer: CustomerCreate): Promise<Customer> => {
    const updatedCustomer = await prisma.customer.update({
        where: { id },
        data: {
            ...customer,
            updatedAt: new Date(),
        },
    });
    return getCustomerResponse(updatedCustomer);
}

export const deleteCustomer = async (id: number): Promise<void> => {

    const customer = await getCustomer(id);
    if (!customer) {
        throw new ValidationError(1004, 404, "Customer not found");
    }

    await prisma.customer.update({
        where: { id },
        data: {
            archived: true,
            archivedAt: new Date(),
            updatedAt: new Date(),
        },
    });
}
