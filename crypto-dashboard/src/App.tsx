import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import Home from './pages/Home';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      refetchInterval: 60000,
    }
  }
});

function App() {

  return (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <div className='p-4'>
      <h1>Crypto Dashboardd</h1>
    </div>
    </BrowserRouter>
  </QueryClientProvider>  
  )
}

export default App
