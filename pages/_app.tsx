import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {Provider} from 'next-auth/client'
import LayoutSecureContent from '../components/layout-secure-content'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <LayoutSecureContent>
        <Component {...pageProps} />
      </LayoutSecureContent>      
    </Provider>   
  )
}
export default MyApp
