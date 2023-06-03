import { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
function useGoogleMapsApi() {
  const [google, setGoogle] = useState<typeof globalThis.google>();
  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["places"],
    });
    loader.load().then((google) => {
      setGoogle(google);
    });
  }, []);
  return google;
}
export default useGoogleMapsApi;
