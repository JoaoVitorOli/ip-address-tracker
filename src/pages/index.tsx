import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Head from 'next/head';
import ReactLoading from "react-loading";

import api from "../services/api";

import styles from "../styles/pages/home.module.css";
import { GetStaticProps } from "next";

interface DataProps {
  ip: string,
  city: string,
  countryCode: string,
  timezone: string,
  isp: string,
  latitude: number,
  longitude: number,
}

export default function Home({ ipifyKey }) {
  const Map = dynamic(
    () => import('../components/Map'),
    { ssr: false }
  );

  const [data, setData] = useState({
    ip: "44.234.32.103",
    city: "Portland",
    countryCode: "US",
    timezone: "-07:00",
    isp: "Amazon.com, Inc.",
    latitude: 45.52345,
    longitude: -122.67621
  } as DataProps);
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const [hasLoading, setHasLoading] = useState(false);

  useEffect(() => {
    setHasLoading(true);
    getInitialData();
    setHasLoading(false);
    setHasError(false);
  }, []);

  function getInitialData() {
    setHasLoading(true);
    api.get(`api/v1?apiKey=${ipifyKey}`).then((resp) => {
      const { data } = resp;

      if (!data) {
        console.log("data null");
        return {
          notFound: true,
        }
      }
  
      const result = {
        ip: data.ip,
        city: data.location.city,
        countryCode: data.location.country,
        timezone: data.location.timezone,
        isp: data.isp,
        latitude: data.location.lat,
        longitude: data.location.lng,
      }

      setData(result);
      setHasLoading(false);
    });
  }
  
  async function handleDoGet() {
    setHasLoading(true);
    if (!inputValue) {
      getInitialData();

      return;
    }

    try {
      const { data } = await api.get(`api/v1?apiKey=${ipifyKey}&ipAddress=${inputValue}`);
  
      const result = {
        ip: data.ip,
        city: data.location.city,
        countryCode: data.location.country,
        timezone: data.location.timezone,
        isp: data.isp,
        latitude: data.location.lat,
        longitude: data.location.lng,
      }

      setHasError(false);
  
      setData(result);
      setHasLoading(false);
    } catch (err) {
      setHasError(true);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Ip Address Tracker</title>
      </Head>

      <header className={styles.header}>
        <h1>IP Address Tracker</h1>

        <div className={hasError ? styles.h1InputError : styles.h1Input}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="button" onClick={handleDoGet}>
            {hasLoading ? (
            <div style={{width: "100%", height: "100%", alignItems: "center", display: "flex", justifyContent: "center"}}>
              <ReactLoading type="spin" color="#fff" height={25} width={25}/>
            </div>
            ) : (
              <img src="icon-arrow.svg" alt="Icon arrow"/>
            )}
            
          </button>
        </div>

        <div className={styles.informations}>
          <div>
            <p>IP ADDRESS</p>
            <span>{data.ip}</span>
          </div>
          <div className={styles.border} />
          <div>
            <p>LOCATION</p>
            <span>{data.city}, {data.countryCode}</span>
          </div>
          <div className={styles.border} />
          <div>
            <p>TIMEZONE</p>
            <span>UTC{data.timezone}</span>
          </div>
          <div className={styles.border} />
          <div>
            <p>ISP</p>
            <span>{data.isp}</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Map 
          coord={data === null ? '' : data}
        />
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const ipifyKey = process.env.IPIFY_API_KEY;

  return {
    props: { 
      ipifyKey
    },
  }
}
