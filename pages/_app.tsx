import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {Provider} from 'next-auth/client'
import LayoutSecureContent from '../components/layout-secure-content'
import { QueryClient, QueryClientProvider} from 'react-query'
 
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <LayoutSecureContent>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </LayoutSecureContent>      
    </Provider>   
  )
}
export default MyApp
