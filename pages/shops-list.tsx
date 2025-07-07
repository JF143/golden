"use client"

import React, { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import { useUser } from "../lib/userContext"

const useResponsive = () => {
  const [isWide, setIsWide] = React.useState(false)
  React.useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 1100)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isWide
}

const ShopsList = () => {
  const [search, setSearch] = useState("");
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isWide = useResponsive();
  const { user, profile } = useUser();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        // Only fetch shops owned by the current user if they're a merchant
        let query = supabase.from('food_stall').select('*');
        
        if (user && profile?.user_type === 'merchant') {
          query = query.eq('owner_id', user.id);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching shops:', error);
        } else {
          setShops(data || []);
        }
      } catch (error) {
        console.error('Error in fetchShops:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchShops();
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  const filteredShops = shops.filter(shop =>
    shop.stall_name.toLowerCase().includes(search.toLowerCase()) ||
    (shop.description && shop.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
