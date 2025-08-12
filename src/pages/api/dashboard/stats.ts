import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {   

    // Get counts for all main entities
    const [customerCount, userCount, productCount, orderCount] = await Promise.all([
      prisma.customer.count({
        where: { archived: false }
      }),
      prisma.user.count({
        where: { archived: false }
      }),
      prisma.product.count({
        where: { archived: false }
      }),
      prisma.order.count({
        where: {
          archived: false
        }
      })
    ]);

    // Get some additional useful stats
    const [totalRevenue, recentOrdersCount] = await Promise.all([
      prisma.order.aggregate({
        _sum: {
          total: true
        }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ]);

    const stats = {
      customers: customerCount,
      users: userCount,
      products: productCount,
      orders: orderCount,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders: recentOrdersCount
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}

