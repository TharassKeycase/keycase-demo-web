import { NextApiRequest, NextApiResponse } from 'next';
import { sendMethodNotAllowed } from '@/lib/errors';
import { resetAndSeedDatabase } from '@/services/seedData';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return resetDataHandler(req, res);
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const resetDataHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('🔄 API: Starting database reset and seed operation...');
    
    await resetAndSeedDatabase();
    
    console.log('✅ API: Database reset and seed completed successfully');
    
    res.status(200).json({ 
      success: true,
      message: "Database has been reset and seeded with test data",
      data: {
        roles: 4,
        users: 6,
        customers: 5,
        products: 20,
        orders: 10,
        defaultPassword: "Welcome1"
      }
    });
  } catch (error: any) {
    console.error('❌ API: Error during database reset:', error);
    
    res.status(500).json({
      success: false,
      message: "Failed to reset database",
      error: error.message || "Unknown error occurred"
    });
  }
}

export default handler;