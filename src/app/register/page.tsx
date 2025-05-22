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

  // Added countryCode to state and initial value
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    countryCode: "+63", // added this line
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [suggestions, setSuggestions] = useState<
    { place_name: string; center: [number, number] }[]
  >([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [121.0, 14.6],
      zoom: 10,
    });
  }, []);

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

  const handleSuggestionClick = (suggestion: {
    place_name: string;
    center: [number, number];
  }) => {
    setFormData({ ...formData, address: suggestion.place_name });
    setSuggestions([]);
    setDropdownVisible(false);

    if (map.current) {
      map.current.flyTo({
        center: suggestion.center,
        zoom: 14,
      });

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
        <div className="space-y-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              className="w-full border rounded px-3 py-2"
              onChange={(e) =>
                setFormData({ ...formData, phone: "", countryCode: e.target.value })
              }
              value={formData.countryCode || "+63"}
            >
              <option value="+63">🇵🇭 Philippines (+63)</option>
              <option value="+1">🇺🇸 USA (+1)</option>
              <option value="+44">🇬🇧 UK (+44)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              <span className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l text-gray-700">
                {formData.countryCode || "+63"}
              </span>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="9123456789"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="rounded-l-none"
              />
            </div>
          </div>
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
