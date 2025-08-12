import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import swaggerConfig from '@/docs/swagger-config';
import Layout from '@/components/layouts/MainLayout';
import { requireAuth } from '@/lib/authHelpers';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => <div>Loading API Documentation...</div>
});

function ApiDocs() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => setSpec(data))
      .catch(err => console.error('Failed to load API spec:', err));
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '20px', 
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>
          CRM API Documentation
        </h1>
        <p style={{ margin: '10px 0 0 0', color: '#666' }}>
          Interactive API documentation powered by OpenAPI 3.0
        </p>
      </div>
      
      {spec && (
        <SwaggerUI 
          spec={spec}
          {...swaggerConfig}
        />
      )}
    </div>
  );
}

export default ApiDocs;

ApiDocs.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth;