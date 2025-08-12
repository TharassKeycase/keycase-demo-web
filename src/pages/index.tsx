import { useSession } from "next-auth/react";
import { requireAuth } from "@/lib/authHelpers";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Divider
} from "@mui/material";
import { useRouter } from "next/router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useEffect, useState } from "react";

import Layout from "@/components/layouts/MainLayout";

interface DashboardStats {
  customers: number;
  users: number;
  products: number;
  orders: number;
  totalRevenue: number;
  recentOrders: number;
}

const DashboardCard = ({ title, icon, description, route, count, onClick }: {
  title: string;
  icon: React.ReactNode;
  description: string;
  route: string;
  count?: number;
  onClick: () => void;
}) => (
  <Card sx={{ 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 3
    }
  }}>
    <CardContent sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        {count !== undefined && (
          <Chip 
            label={count} 
            color="primary" 
            size="small"
            sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
          />
        )}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" onClick={onClick} sx={{ width: '100%' }}>
        Manage {title}
      </Button>
    </CardActions>
  </Card>
);

const Index = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardCards = [
    {
      title: "Customers",
      icon: <PersonIcon color="primary" />,
      description: "Manage customer information and profiles",
      route: "/customers",
      count: stats?.customers
    },
    {
      title: "Orders", 
      icon: <ShoppingCartIcon color="primary" />,
      description: "View and manage customer orders",
      route: "/orders",
      count: stats?.orders
    },
    {
      title: "Products",
      icon: <InventoryIcon color="primary" />,
      description: "Manage product catalog and inventory",
      route: "/products",
      count: stats?.products
    },
    {
      title: "Users",
      icon: <PeopleAltIcon color="primary" />,
      description: "Manage system users and permissions",
      route: "/users",
      count: stats?.users
    }
  ];

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {(session?.user as any)?.name || (session as any)?.username || 'User'}!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {dashboardCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <DashboardCard
              title={card.title}
              icon={card.icon}
              description={card.description}
              route={card.route}
              count={card.count}
              onClick={() => router.push(card.route)}
            />
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendingUpIcon sx={{ mr: 1 }} />
          Quick Stats
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : stats ? (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.totalRevenue.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Revenue
                      </Typography>
                    </Box>
                    <AttachMoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.recentOrders}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Recent Orders (30 days)
                      </Typography>
                    </Box>
                    <ShoppingCartIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.orders > 0 ? (stats.totalRevenue / stats.orders).toFixed(2) : '0.00'}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Average Order Value
                      </Typography>
                    </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No statistics available
          </Typography>
        )}
      </Paper>
    </>
  );
};

Index.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth;

export default Index;
