"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface FeedItem {
  id: string;
  title: string;
  description: string;
  summary: string;
  imageUrl: string;
  author: string;
}

export default function FeedItemPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [item, setItem] = useState<FeedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFeed();
  }, [id]);

  const getFeed = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/feed/${id}`
      );
      setItem(response.data.feed);
    } catch (err) {
      setError("Failed to fetch feed data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // console.log(item);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Feed item not found</div>;

  return (
    <div className="bg-[#121212]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div>
          <img
            src={item.imageUrl}
            alt={`image ${item.id}`}
            className="w-full h-64 object-cover mb-4 rounded-lg"
          />
        </div>
        <div>
        <div className="lg:text-end text-center">
          <h1 className="text-xl text-gray-500 font-medium mb-4">Author: {item.author}</h1>
        </div>
        <div className="lg:text-start text-center" >
          <h1 className="text-3xl font-medium mb-4">{item.title}</h1>
        </div>
        <div className="lg:text-start text-center">
          <p className="text-neutral-300  mb-4">{item.description}</p>
        </div>
        <div className="lg:text-start text-center" >
          <p className="text-neutral-300 mb-4">{item.summary}</p>
        </div>
        </div>
        <Link href="/feed" className="text-cyan-500 hover:text-blue-800">
          Back to Feed
        </Link>
      </div>
    </div>
  );
}
