import { useEffect, useState, useCallback } from "react";
import type { InputRef } from "antd";
import useGoogleMapsApi from "@/hooks/useGoogleMapsApi";
interface UseGoogleMapAutocompleteOptions {
  onPlaceChanged?: (place: google.maps.places.PlaceResult) => void;
}
export default function useGoogleMapAutocomplete({
  onPlaceChanged,
}: UseGoogleMapAutocompleteOptions) {
  const google = useGoogleMapsApi();
  const [addressSearchInput, setAddressSearchInput] =
    useState<HTMLInputElement | null>(null);

  const inputRef = useCallback((c: InputRef | null | HTMLInputElement) => {
    if (c !== null && "input" in c) {
      setAddressSearchInput(c.input);
    }
    if (c !== null) {
      setAddressSearchInput(c as HTMLInputElement);
    }
  }, []);

  // const [predictions, setPredictions] = useState([]);
  // const [text, setText] = useState("");

  // const autocompleteService = new google.maps.places.AutocompleteService();

  // const handleTextChange = (event) => {
  //   setText(event.target.value);
  // };

  // const handleSuggestions = (predictions, status) => {
  //   if (status != google.maps.places.PlacesServiceStatus.OK) {
  //     setPredictions([]);
  //     return;
  //   }
  //   setPredictions(predictions);
  // };

  // const handleSearch = () => {
  //   autocompleteService.getPlacePredictions(
  //     {
  //       input: text,
  //       origin: latLng,
  //       componentRestrictions: {
  //         country: "NG", // country: string | string[];
  //       },
  //     },
  //     handleSuggestions
  //   );
  // };

  // const handleClickPlace = (placeId, description) => {
  //   placeService.getDetails({ placeId }, (place, status) => {
  //     if (status !== google.maps.places.PlacesServiceStatus.OK) {
  //       return;
  //     }
  //     if (place.geometry) {
  //       let obj = {
  //         lat: place.geometry.location.lat(),
  //         lng: place.geometry.location.lng(),
  //       };
  //       // googleMap.setCenter(obj);
  //       // marker.setPosition(obj);
  //       // setLatLng(obj);
  //       setText(description);
  //       setPredictions([]);
  //     }
  //   });
  // };

  //new
  useEffect(() => {
    if (!google || !addressSearchInput) return;
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
    const autocomplete = new google.maps.places.Autocomplete(
      addressSearchInput,
      options
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      addressSearchInput.value = place.name || "";
      onPlaceChanged && onPlaceChanged(place);
    });
  }, [google, addressSearchInput]);
  return {
    inputRef,
  };
}
