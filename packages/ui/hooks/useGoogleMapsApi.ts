import { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
function useGoogleMapsApi(apiKey: string) {
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
