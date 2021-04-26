import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Head from 'next/head';

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

export default function Home({ result, ipifyKey }) {
  const Map = dynamic(
    () => import('../components/Map'),
    { ssr: false } 
  );

  const [data, setData] = useState({} as DataProps);
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setData(result);
  }, [result]);

  async function handleDoGet() {
    if (!inputValue) {
      setData(result);

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
            <img src="icon-arrow.svg" alt="Icon arrow"/>
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
  const { data } = await api.get(`api/v1?apiKey=${ipifyKey}`);

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

  return {
    props: { 
      result,
      ipifyKey
    },
  }
}
