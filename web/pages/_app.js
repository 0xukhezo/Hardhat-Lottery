import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";

function Web({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default Web;
