import React, { useRef, useState, useEffect } from 'react';
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from '../lib/supabaseClient';

const categories = [
  { name: 'Breakfast', icon: '🍳' },
  { name: 'Lunch', icon: '🍱' },
  { name: 'Dinner', icon: '🍽️' },
  { name: 'Snacks', icon: '🍟' },
  { name: 'Drinks', icon: '🥤' },
  { name: 'Desserts', icon: '🍨' },
];

const AddItem = () => {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [details, setDetails] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string>('');
  const [foodStallId, setFoodStallId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchShop = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage('You must be logged in to add an item.');
        return;
      }
      const { data: stallData, error: stallError } = await supabase
        .from('food_stall')
        .select('id, stall_name, owner_id')
        .eq('owner_id', user.id)
        .single();
      if (stallError || !stallData) {
        setMessage('Could not find your shop.');
        setShopName('');
        setFoodStallId(null);
      } else {
        setShopName(stallData.stall_name);
        setFoodStallId(stallData.id);
      }
    };
    fetchShop();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    let imageUrl = null;
    // Upload image to Supabase Storage if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('product-images').upload(fileName, imageFile);
      if (error) {
        setMessage('Image upload failed: ' + error.message);
        setLoading(false);
        return;
      }
      imageUrl = supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
    }
    // Insert product into DB
    const { error: insertError } = await supabase.from('product').insert([
      {
        product_name: productName,
        unit_price: unitPrice,
        category,
        ingredients,
        details,
        image_url: imageUrl,
        food_stall_id: foodStallId,
      }
    ]);
    if (insertError) {
      setMessage('Error adding item: ' + insertError.message);
    } else {
      setMessage('Item added successfully!');
      setProductName('');
      setUnitPrice('');
      setCategory('');
      setIngredients('');
      setDetails('');
      setImageFile(null);
      setImagePreview(null);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Add Item - Golden Bites</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>
      <div style={{ background: '#f4f6fa', minHeight: '100vh', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Top Bar */}
        <div style={{
          width: '100%',
          maxWidth: 500,
          background: '#fff',
          borderRadius: '0 0 18px 18px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          marginBottom: 0
        }}>
          <a onClick={e => { e.preventDefault(); router.push('/food_list'); }} href="/food_list" style={{ fontSize: 22, color: '#222', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><i className="fas fa-arrow-left"></i></a>
          <h1 style={{ fontSize: 19, fontWeight: 700, color: '#222', margin: 0, textAlign: 'center', flexGrow: 1 }}>{shopName}</h1>
          <img src="/img/logo.png" alt="Logo" style={{ height: 32, width: 32, borderRadius: 8, objectFit: 'cover' }} />
        </div>
        {/* Main Card */}
        <div style={{
          width: '100%',
          maxWidth: 700,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          margin: '32px 0',
          padding: '28px 18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}>
          <div style={{ marginBottom: 22 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1c1e21', margin: 0, marginBottom: 6 }}>Add Item</h1>
            <p style={{ fontSize: 15, color: '#606770', margin: 0 }}>Add a new food item to your menu</p>
          </div>
          {message && <div style={{ marginBottom: 18, color: message.includes('success') ? '#006421' : '#c72a00', background: message.includes('success') ? '#e6ffed' : '#ffebe6', border: '1px solid', borderColor: message.includes('success') ? '#a3e2b4' : '#ffc4b3', padding: '12px 15px', borderRadius: 6, textAlign: 'center', fontSize: 15 }}>{message}</div>}
          <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ width: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label-custom" style={{ display: 'block', fontWeight: 600, fontSize: 15, color: '#222', marginBottom: 8 }}>Product Image</label>
              <div style={{ width: 110, height: 110, border: '2px dashed #ccd0d5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8f9fa', marginBottom: 10, overflow: 'hidden', marginLeft: 'auto', marginRight: 'auto' }} onClick={handleImageBoxClick}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                ) : (
                  <i className="fas fa-camera" style={{ fontSize: 32, color: '#adb5bd' }}></i>
                )}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label className="form-label-custom" style={{ fontWeight: 600, fontSize: 15, color: '#222', marginBottom: 8 }}>Product Name</label>
              <input type="text" value={productName} onChange={e => setProductName(e.target.value)} required style={{ width: '100%', padding: '12px 15px', border: '1px solid #ccd0d5', borderRadius: 7, fontSize: 16, background: '#fff', color: '#222', marginBottom: 0, outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label className="form-label-custom" style={{ fontWeight: 600, fontSize: 15, color: '#222', marginBottom: 8 }}>Unit Price</label>
              <input type="number" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} required style={{ width: '100%', padding: '12px 15px', border: '1px solid #ccd0d5', borderRadius: 7, fontSize: 16, background: '#fff', color: '#222', marginBottom: 0, outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label className="form-label-custom" style={{ fontWeight: 600, fontSize: 15, color: '#222', marginBottom: 8 }}>Category</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
                {categories.map(cat => (
                  <button
                    type="button"
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: '14px 18px',
                      border: category === cat.name ? '2px solid #1877f2' : '1.5px solid #ccd0d5',
                      borderRadius: 12,
                      background: category === cat.name ? '#e8f0fe' : '#fff',
                      color: '#222',
                      fontWeight: 500,
                      fontSize: 16,
                      cursor: 'pointer',
                      minWidth: 90,
                      boxShadow: category === cat.name ? '0 2px 8px rgba(24,119,242,0.08)' : 'none',
                      transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 28, marginBottom: 4 }}>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
              <input type="hidden" value={category} required />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label className="form-label-custom" style={{ fontWeight: 600, fontSize: 15, color: '#222', marginBottom: 8 }}>Ingredients</label>
              <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} style={{ width: '100%', padding: '12px 15px', border: '1px solid #ccd0d5', borderRadius: 7, fontSize: 16, background: '#fff', color: '#222', minHeight: 70, resize: 'vertical', marginBottom: 0, outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label className="form-label-custom" style={{ fontWeight: 600, fontSize: 15, color: '#222', marginBottom: 8 }}>Details</label>
              <textarea value={details} onChange={e => setDetails(e.target.value)} style={{ width: '100%', padding: '12px 15px', border: '1px solid #ccd0d5', borderRadius: 7, fontSize: 16, background: '#fff', color: '#222', minHeight: 70, resize: 'vertical', marginBottom: 0, outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: 13, background: '#1877f2', color: 'white', border: 'none', borderRadius: 7, fontSize: 17, fontWeight: 700, cursor: 'pointer', transition: 'background-color 0.2s', marginTop: 10 }} disabled={loading}>
              {loading ? 'Adding...' : 'Add Item to Menu'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddItem; 