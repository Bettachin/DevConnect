"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map"), { ssr: false });

// ✅ Define the correct User type based on JSONPlaceholder structure
type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
};

export default function DeveloperProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => res.json())
      .then(setUser);
  }, [id]);

  if (!user) return <p>Loading...</p>;

  const lat = parseFloat(user.address.geo.lat);
  const lng = parseFloat(user.address.geo.lng);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{user.name}</h1>
      <p className="text-muted-foreground">Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>
        Address: {user.address.street}, {user.address.city}
      </p>
      <Map lat={lat} lng={lng} />
    </div>
  );
}
