import React, { useState } from 'react';

// Sample Product Data
const initialProducts = [
  { id: 1, name: 'Noir Oversized T-Shirt', price: 799, category: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80', stock: 10 },
  { id: 2, name: 'Minimalist Black Hoodie', price: 1499, category: 'Hoodies', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80', stock: 5 },
  { id: 3, name: 'Classic Denim Jacket', price: 2199, category: 'Jackets', image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500&q=80', stock: 3 },
  { id: 4, name: 'Urban Cargo Pants', price: 1299, category: 'Bottoms', image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&q=80', stock: 8 },
];

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'cart', 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Admin form state
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newImage, setNewImage] = useState('');

  // Add to cart
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculate total
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add new product (Admin)
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    const newProd = {
      id: Date.now(),
      name: newName,
      price: Number(newPrice),
      category: newCategory || 'General',
      image: newImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
      stock: 10
    };
    setProducts([...products, newProd]);
    setNewName('');
    setNewPrice('');
    setNewCategory('');
    setNewImage('');
    alert('Product added successfully!');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Header */}
      <header style={{ backgroundColor: '#111', color: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>🛍️ PURNIMA FASHION</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setActiveTab('shop')} style={navBtnStyle(activeTab === 'shop')}>Shop</button>
          <button onClick={() => setActiveTab('cart')} style={navBtnStyle(activeTab === 'cart')}>Cart ({cart.length})</button>
          <button onClick={() => setActiveTab('admin')} style={navBtnStyle(activeTab === 'admin')}>Admin</button>
        </div>
      </header>

      {/* SHOP TAB */}
      {activeTab === 'shop' && (
        <div style={{ padding: '20px' }}>
          {/* Search & Filter */}
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px', fontSize: '16px', boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '5px' }}>
            {['All', 'T-Shirts', 'Hoodies', 'Jackets', 'Bottoms'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: selectedCategory === cat ? '#111' : '#e0e0e0', color: selectedCategory === cat ? '#fff' : '#333', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
            {filteredProducts.map(product => (
              <div key={product.id} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }} />
                <h4 style={{ fontSize: '14px', margin: '10px 0 5px 0', height: '35px', overflow: 'hidden' }}>{product.name}</h4>
                <p style={{ fontWeight: 'bold', color: '#e44d26', margin: '0 0 10px 0' }}>₹{product.price}</p>
                <button 
                  onClick={() => addToCart(product)}
                  style={{ backgroundColor: '#111', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CART TAB */}
      {activeTab === 'cart' && (
        <div style={{ padding: '20px' }}>
          <h2>Your Shopping Cart</h2>
          {cart.length === 0 ? (
            <p style={{ color: '#777' }}>Your cart is empty.</p>
          ) : (
            <div>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                    <p style={{ margin: 0, color: '#555' }}>₹{item.price} x {item.qty}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
              <div style={{ marginTop: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3>Total: ₹{totalPrice}</h3>
                <button 
                  onClick={() => { alert('Order placed successfully! 🎉'); setCart([]); }}
                  style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '12px', width: '100%', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
                >
                  Checkout Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADMIN TAB */}
      {activeTab === 'admin' && (
        <div style={{ padding: '20px' }}>
          <h2>Admin Panel - Add Product</h2>
          <form onSubmit={handleAddProduct} style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Name</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price (₹)</label>
              <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
              <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="e.g., T-Shirts" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Image URL</label>
              <input type="text" value={newImage} onChange={e => setNewImage(e.target.value)} placeholder="https://..." style={inputStyle} />
            </div>
            <button type="submit" style={{ backgroundColor: '#111', color: '#fff', border: 'none', padding: '12px', width: '100%', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Add Product</button>
          </form>
        </div>
      )}

    </div>
  );
}

// Styles
const navBtnStyle = (isActive) => ({
  background: 'none',
  border: 'none',
  color: isActive ? '#fff' : '#aaa',
  fontSize: '15px',
  fontWeight: isActive ? 'bold' : 'normal',
  cursor: 'pointer',
  padding: '5px 0'
});

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  boxSizing: 'border-box'
};
