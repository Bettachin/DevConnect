"use client";

import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function RegisterPage() {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [suggestions, setSuggestions] = useState<
    { place_name: string; center: [number, number] }[]
  >([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Initialize map on first render
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [121.0, 14.6], // Default center (e.g., Manila)
      zoom: 10,
    });
  }, []);

  // Fetch address suggestions from Mapbox API with coordinates
  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}&autocomplete=true&limit=5`
      );
      const data = await res.json();
      if (data.features) {
        // store full feature (place_name + coordinates)
        setSuggestions(data.features);
      }
    } catch (err) {
      console.error("Mapbox autocomplete error:", err);
      setSuggestions([]);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });
    fetchSuggestions(value);
    setDropdownVisible(true);
  };

  // When user clicks a suggestion
  const handleSuggestionClick = (suggestion: {
    place_name: string;
    center: [number, number];
  }) => {
    setFormData({ ...formData, address: suggestion.place_name });
    setSuggestions([]);
    setDropdownVisible(false);

    // Center map and add marker
    if (map.current) {
      map.current.flyTo({
        center: suggestion.center,
        zoom: 14,
      });

      // Add or move marker
      if (marker.current) {
        marker.current.setLngLat(suggestion.center);
      } else {
        marker.current = new mapboxgl.Marker()
          .setLngLat(suggestion.center)
          .addTo(map.current);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
          phone: formData.phone,
          address: formData.address,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage("Check your email for a confirmation link.");
      setError("");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-3xl font-bold">Register</h1>
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm space-y-4 relative"
        autoComplete="off"
      >
        <div>
          <Label>Username</Label>
          <Input
            type="text"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="your username"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="********"
          />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="123-456-7890"
          />
        </div>
        <div className="relative">
          <Label>Address</Label>
          <Input
            type="text"
            value={formData.address}
            onChange={handleAddressChange}
            placeholder="Start typing your address..."
            onFocus={() => setDropdownVisible(true)}
          />
          {isDropdownVisible && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded-md w-full max-h-40 overflow-auto mt-1">
              {suggestions.map((sug, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSuggestionClick(sug)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {sug.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert variant="default" className="mb-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
      <div
        ref={mapContainer}
        className="w-full max-w-sm h-64 rounded-md border mt-4"
      />
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>

      
    </main>
  );
}
