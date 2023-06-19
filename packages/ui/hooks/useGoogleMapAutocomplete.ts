import { useEffect, useState, useCallback, useRef } from "react";
import type { InputRef } from "antd";
import useGoogleMapsApi from "./useGoogleMapsApi";
interface UseGoogleMapAutocompleteOptions {
  onPlaceChanged?: (place: google.maps.places.PlaceResult) => void;
  apiKey: string;
}
export default function useGoogleMapAutocomplete({
  onPlaceChanged,
  apiKey,
}: UseGoogleMapAutocompleteOptions) {
  const google = useGoogleMapsApi(apiKey);
  const addressSearchInput = useRef<HTMLInputElement | null>(null);

  const inputRef = useCallback((c: InputRef | null | HTMLInputElement) => {
    if (c !== null) {
      if ("input" in c) {
        addressSearchInput.current = c.input;
      } else {
        addressSearchInput.current = c as HTMLInputElement;
      }
    }
  }, []);

  //new
  useEffect(() => {
    if (!google || !addressSearchInput.current) return;
    const center = { lat: 50.064192, lng: -130.605469 };
    // Create a bounding box with sides ~10km away from the center point
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };
    const options = {
      // bounds: defaultBounds,
      componentRestrictions: { country: "vn" },
      fields: ["address_components", "geometry", "icon", "name"],
      strictBounds: false,
      types: ["establishment"],
    };
    if (!addressSearchInput) {
      console.log("ko co input");
    }
    console.log("Ne", addressSearchInput.current);
    const autocomplete = new google.maps.places.Autocomplete(
      addressSearchInput.current,
      options
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (addressSearchInput.current)
        addressSearchInput.current.value = place.name || "";
      onPlaceChanged && onPlaceChanged(place);
    });
  }, [google, addressSearchInput.current]);
  return {
    inputRef,
  };
}
