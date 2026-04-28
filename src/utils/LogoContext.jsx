import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./SupabaseClient";

const LogoContext = createContext(null);

export const LogoProvider = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    supabase
      .from("StoreSettings")
      .select("logo_url")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.logo_url) setLogoUrl(data.logo_url);
      });
  }, []);

  return (
    <LogoContext.Provider value={{ logoUrl, setLogoUrl }}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => useContext(LogoContext);
