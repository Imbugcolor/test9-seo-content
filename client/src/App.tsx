import React from 'react';
import { Layout } from 'antd';
import SEORewriter from './components/SEORewriter';
const { Header, Content, Footer } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white'
          }}
        >
          <div className="demo-logo">SEO CONTENT</div>
        </Header>
        <Layout>
          <Content style={{ minHeight: '79vh', padding: '0 50px' }}>
            <SEORewriter />
          </Content>
        </Layout>
        <Footer>footer</Footer>
      </Layout>
    </div>
  );
}

export default App;
