import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AppProvider } from "../contexts/AppContext";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import Notification from "../components/common/Notification";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Head>
        <title>Teacher Management</title>
        <link rel="icon" href="https://i.postimg.cc/LXTKzvyb/Preview-4.jpg" type="image/jpeg" />
      </Head>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-gray-50">
          <Header title="Teacher Management" />
          <Notification />
          <main className="flex-1 p-4">
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
