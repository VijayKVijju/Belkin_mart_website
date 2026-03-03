
//------------------- Dynamic
/*
import React, { useState, useEffect } from 'react';
import {
  Squares2X2Icon, ShoppingBagIcon, ClipboardDocumentListIcon, UserCircleIcon,
  ArrowPathIcon, TruckIcon, BellIcon, ChartBarIcon, ShieldCheckIcon,
  QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon, ArrowUpIcon, ArrowDownIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon, CurrencyRupeeIcon, StarIcon,
  ChatBubbleLeftIcon, DocumentArrowUpIcon, PhoneIcon, EnvelopeIcon,
  PlusIcon, PencilIcon, TrashIcon, XMarkIcon, MagnifyingGlassIcon, PhotoIcon,
} from '@heroicons/react/24/outline';

import { supabase } from '../supabaseClient';
import VendorHeader from '../components/vendor/VendorHeader';
import VendorFooter from '../components/vendor/VendorFooter';
import Overview from '../components/vendor/VendorDashboard';
import Profile from '../components/vendor/VendorProfile';

const Badge = ({ color, children }) => {
  const colors = {
    green:  'bg-green-50  text-green-700  border-green-200',
    red:    'bg-red-50    text-red-700    border-red-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    blue:   'bg-blue-50   text-blue-700   border-blue-200',
    slate:  'bg-slate-50  text-slate-600  border-slate-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
};

const StatCard = ({ label, value, change, up, icon: Icon, accent }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="text-2xl font-black text-slate-900">{value}</div>
    {change && up !== null && (
      <div className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-500'}`}>
        {up ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
        {change} vs last month
      </div>
    )}
    {change && up === null && (
      <div className="text-xs font-semibold text-orange-500">{change}</div>
    )}
  </div>
);

const SectionTitle = ({ children, sub }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{children}</h2>
    {sub && <p className="text-sm text-slate-500 mt-1">{sub}</p>}
  </div>
);

const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
  </div>
);

const emptyProduct = {
  name: '', slug: '', description: '', short_description: '',
  price: '', discount_price: '', sku: '', stock_quantity: '',
  brand: '', condition: 'new', warranty_period: '',
  is_active: true, is_featured: false, category_id: '',
};

const emptyVariant = { variant_name: '', variant_value: '', price_adjustment: '', stock_quantity: '', sku: '' };
const emptyImage   = { image_url: '', is_primary: false, display_order: 0 };

function ProductsTab() {
  const [products,        setProducts]        = useState([]);
  const [categories,      setCategories]      = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [showModal,       setShowModal]       = useState(false);
  const [activeStep,      setActiveStep]      = useState(1);
  const [editingProduct,  setEditingProduct]  = useState(null);
  const [form,            setForm]            = useState(emptyProduct);
  const [variants,        setVariants]        = useState([]);
  const [images,          setImages]          = useState([{ ...emptyImage, is_primary: true }]);
  const [search,          setSearch]          = useState('');
  const [filterStatus,    setFilterStatus]    = useState('all');
  const [error,           setError]           = useState('');
  const [successMsg,      setSuccessMsg]      = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [productImages,   setProductImages]   = useState({});
  const [productVariants, setProductVariants] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ✅ FIX: vendorId read fresh inside fetch, no filter if missing → fetch all
  const fetchProducts = async () => {
    setLoading(true);
    const vendorId = localStorage.getItem('vendor_id');

    let query = supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    const { data, error: err } = await query;
    if (err) {
      console.error('Error fetching products:', err.message);
    }
    setProducts(data || []);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').eq('is_active', true);
    setCategories(data || []);
  };

  const fetchProductDetails = async (productId) => {
    if (productImages[productId] && productVariants[productId]) return;
    const [{ data: imgs }, { data: vars }] = await Promise.all([
      supabase.from('product_images').select('*').eq('product_id', productId).order('display_order'),
      supabase.from('product_variants').select('*').eq('product_id', productId),
    ]);
    setProductImages(p  => ({ ...p, [productId]: imgs || [] }));
    setProductVariants(p => ({ ...p, [productId]: vars || [] }));
  };

  const toggleExpand = (productId) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
      fetchProductDetails(productId);
    }
  };

  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setVariants([]);
    setImages([{ ...emptyImage, is_primary: true }]);
    setActiveStep(1);
    setError('');
    setShowModal(true);
  };

  const openEditModal = async (product) => {
    setEditingProduct(product);
    setForm({
      name:              product.name              || '',
      slug:              product.slug              || '',
      description:       product.description       || '',
      short_description: product.short_description || '',
      price:             product.price             || '',
      discount_price:    product.discount_price    || '',
      sku:               product.sku               || '',
      stock_quantity:    product.stock_quantity    || '',
      brand:             product.brand             || '',
      condition:         product.condition         || 'new',
      warranty_period:   product.warranty_period   || '',
      is_active:         product.is_active         ?? true,
      is_featured:       product.is_featured       ?? false,
      category_id:       product.category_id       || '',
    });
    const [{ data: imgs }, { data: vars }] = await Promise.all([
      supabase.from('product_images').select('*').eq('product_id', product.id).order('display_order'),
      supabase.from('product_variants').select('*').eq('product_id', product.id),
    ]);
    setImages(imgs?.length ? imgs : [{ ...emptyImage, is_primary: true }]);
    setVariants(vars || []);
    setActiveStep(1);
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product and all its images/variants?')) return;
    await Promise.all([
      supabase.from('product_images').delete().eq('product_id', id),
      supabase.from('product_variants').delete().eq('product_id', id),
    ]);
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
    setSuccessMsg('Product deleted.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSave = async () => {
    if (!form.name.trim())    { setError('Product name is required.');   setActiveStep(1); return; }
    if (!form.price)          { setError('Price is required.');          setActiveStep(1); return; }
    if (!form.stock_quantity) { setError('Stock quantity is required.'); setActiveStep(1); return; }
    if (!form.category_id)    { setError('Please select a category.');   setActiveStep(1); return; }
    const validImages = images.filter(i => i.image_url?.trim());
    if (validImages.length === 0) { setError('Add at least one product image URL.'); setActiveStep(2); return; }

    setSaving(true);
    setError('');

    // ✅ FIX: fresh read inside save too
    const vendorId = localStorage.getItem('vendor_id');

    const payload = {
      vendor_id:         vendorId,
      name:              form.name.trim(),
      slug:              form.slug || generateSlug(form.name),
      description:       form.description.trim(),
      short_description: form.short_description.trim(),
      price:             parseFloat(form.price),
      discount_price:    form.discount_price ? parseFloat(form.discount_price) : null,
      sku:               form.sku.trim(),
      stock_quantity:    parseInt(form.stock_quantity),
      brand:             form.brand.trim(),
      condition:         form.condition,
      warranty_period:   form.warranty_period.trim(),
      is_active:         form.is_active,
      is_featured:       form.is_featured,
      category_id:       form.category_id,
      updated_at:        new Date().toISOString(),
    };

    let productId = editingProduct?.id;

    if (editingProduct) {
      const { error: err } = await supabase.from('products').update(payload).eq('id', productId);
      if (err) { setError(err.message); setSaving(false); return; }
      await Promise.all([
        supabase.from('product_images').delete().eq('product_id', productId),
        supabase.from('product_variants').delete().eq('product_id', productId),
      ]);
    } else {
      payload.created_at = new Date().toISOString();
      const { data, error: err } = await supabase.from('products').insert(payload).select().single();
      if (err) { setError(err.message); setSaving(false); return; }
      productId = data.id;
    }

    if (validImages.length > 0) {
      await supabase.from('product_images').insert(
        validImages.map((img, idx) => ({
          product_id:    productId,
          image_url:     img.image_url.trim(),
          is_primary:    idx === 0 ? true : !!img.is_primary,
          display_order: idx,
          created_at:    new Date().toISOString(),
        }))
      );
    }

    const validVariants = variants.filter(v => v.variant_name?.trim() && v.variant_value?.trim());
    if (validVariants.length > 0) {
      await supabase.from('product_variants').insert(
        validVariants.map(v => ({
          product_id:       productId,
          variant_name:     v.variant_name.trim(),
          variant_value:    v.variant_value.trim(),
          price_adjustment: v.price_adjustment ? parseFloat(v.price_adjustment) : 0,
          stock_quantity:   v.stock_quantity   ? parseInt(v.stock_quantity)      : 0,
          sku:              v.sku?.trim() || '',
          created_at:       new Date().toISOString(),
        }))
      );
    }

    setSaving(false);
    setShowModal(false);
    setProductImages({});
    setProductVariants({});
    setSuccessMsg(editingProduct ? 'Product updated!' : 'Product added!');
    setTimeout(() => setSuccessMsg(''), 3000);
    fetchProducts();
  };

  const toggleActive = async (id, current) => {
    await supabase.from('products').update({ is_active: !current }).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
  };

  const addVariantRow = () => setVariants(v => [...v, { ...emptyVariant }]);
  const removeVariant = (i) => setVariants(v => v.filter((_, idx) => idx !== i));
  const updateVariant = (i, field, val) => setVariants(v => v.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const addImageRow   = () => setImages(v => [...v, { ...emptyImage, display_order: v.length }]);
  const removeImage   = (i) => setImages(v => v.filter((_, idx) => idx !== i));
  const updateImage   = (i, field, val) => setImages(v => v.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  const filtered = products.filter(p => {
    const matchSearch  = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus  = filterStatus === 'all' ? true : filterStatus === 'active' ? p.is_active : !p.is_active;
    return matchSearch && matchStatus;
  });

  const totalActive   = products.filter(p =>  p.is_active).length;
  const totalInactive = products.filter(p => !p.is_active).length;
  const lowStock      = products.filter(p =>  p.stock_quantity <= 5).length;
  const steps         = ['Basic Info', 'Images', 'Variants'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Manager</h2>
          <p className="text-sm text-slate-500 mt-1">Add, edit and manage your product listings</p>
        </div>
        <button onClick={openAddModal}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-orange-100">
          <PlusIcon className="w-4 h-4" /> Add Product
        </button>
      </div>

      {successMsg && (
        <div className="mb-5 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          ✅ {successMsg}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: products.length, color: 'bg-blue-50 text-blue-500',   icon: ShoppingBagIcon },
          { label: 'Active',         value: totalActive,     color: 'bg-green-50 text-green-500', icon: CheckCircleIcon },
          { label: 'Inactive',       value: totalInactive,   color: 'bg-slate-50 text-slate-500', icon: XCircleIcon     },
          { label: 'Low Stock (≤5)', value: lowStock,        color: 'bg-red-50 text-red-500',     icon: ClockIcon       },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon className="w-5 h-5" />
            </div>
            <div className="text-xl font-black text-slate-900">{c.value}</div>
            <div className="text-xs text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="outline-none text-sm flex-1 text-slate-700 bg-transparent" />
        </div>
        {['all', 'active', 'inactive'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition capitalize ${filterStatus === s ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Product', 'Category', 'Price', 'Stock', 'SKU', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                    {products.length === 0 ? 'No products yet. Click "Add Product" to get started.' : 'No products match your search.'}
                  </td>
                </tr>
              ) : filtered.map(p => (
                <React.Fragment key={p.id}>
                  <tr className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {productImages[p.id]?.[0]?.image_url ? (
                          <img src={productImages[p.id][0].image_url} alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <PhotoIcon className="w-5 h-5 text-slate-300" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-800 max-w-[180px] truncate">{p.name}</p>
                          {p.brand && <p className="text-xs text-slate-400">{p.brand}</p>}
                          {p.warranty_period && <p className="text-xs text-slate-300">Warranty: {p.warranty_period}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.categories?.name || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">₹{parseFloat(p.price).toLocaleString('en-IN')}</div>
                      {p.discount_price && (
                        <div className="text-xs text-green-600 font-semibold">₹{parseFloat(p.discount_price).toLocaleString('en-IN')} offer</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${p.stock_quantity <= 5 ? 'text-red-500' : 'text-slate-800'}`}>
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">{p.sku || '—'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleActive(p.id, p.is_active)}>
                        <Badge color={p.is_active ? 'green' : 'slate'}>{p.is_active ? 'Active' : 'Inactive'}</Badge>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleExpand(p.id)}
                          className="text-xs text-slate-400 hover:text-blue-500 transition font-medium">
                          {expandedProduct === p.id ? 'Hide' : 'Details'}
                        </button>
                        <button onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedProduct === p.id && (
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-3">Product Images</p>
                            {!productImages[p.id] ? (
                              <p className="text-xs text-slate-400">Loading...</p>
                            ) : productImages[p.id].length === 0 ? (
                              <p className="text-xs text-slate-400">No images added</p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {productImages[p.id].map((img, i) => (
                                  <div key={i} className="relative">
                                    <img src={img.image_url} alt=""
                                      className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                                    {img.is_primary && (
                                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-bold px-1 rounded-full">★</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-3">Variants</p>
                            {!productVariants[p.id] ? (
                              <p className="text-xs text-slate-400">Loading...</p>
                            ) : productVariants[p.id].length === 0 ? (
                              <p className="text-xs text-slate-400">No variants added</p>
                            ) : (
                              <div className="space-y-2">
                                {productVariants[p.id].map((v, i) => (
                                  <div key={i} className="flex items-center gap-3 text-xs">
                                    <span className="font-semibold text-slate-700">{v.variant_name}: {v.variant_value}</span>
                                    {v.price_adjustment !== 0 && <span className="text-green-600">+₹{v.price_adjustment}</span>}
                                    <span className="text-slate-400">Stock: {v.stock_quantity}</span>
                                    {v.sku && <span className="font-mono text-slate-300">{v.sku}</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {p.description && (
                          <div className="mt-4">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Description</p>
                            <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-xl font-bold text-slate-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="flex border-b border-slate-100 flex-shrink-0">
              {steps.map((s, i) => (
                <button key={s} onClick={() => setActiveStep(i + 1)}
                  className={`flex-1 py-3 text-sm font-semibold transition border-b-2 ${activeStep === i + 1 ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-2 ${activeStep === i + 1 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                  {s}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
              )}

              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name *</label>
                      <input type="text" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: generateSlug(e.target.value) }))}
                        placeholder="Enter product name"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Slug</label>
                      <input type="text" value={form.slug}
                        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                        placeholder="auto-generated"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-slate-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹) *</label>
                      <input type="number" value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Price (₹)</label>
                      <input type="number" value={form.discount_price}
                        onChange={e => setForm(f => ({ ...f, discount_price: e.target.value }))}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">SKU</label>
                      <input type="text" value={form.sku}
                        onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                        placeholder="SKU-001"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Stock Quantity *</label>
                      <input type="number" value={form.stock_quantity}
                        onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
                      <select value={form.category_id}
                        onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white">
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Brand</label>
                      <input type="text" value={form.brand}
                        onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                        placeholder="Brand name"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Condition</label>
                      <select value={form.condition}
                        onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white">
                        <option value="new">New</option>
                        <option value="used">Used</option>
                        <option value="refurbished">Refurbished</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Warranty Period</label>
                      <input type="text" value={form.warranty_period}
                        onChange={e => setForm(f => ({ ...f, warranty_period: e.target.value }))}
                        placeholder="e.g. 1 Year, 6 Months"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Short Description</label>
                      <input type="text" value={form.short_description}
                        onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))}
                        placeholder="One-line product summary"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                      <textarea value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Full product description"
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.is_active}
                          onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                          className="w-4 h-4 accent-orange-500" />
                        <span className="text-sm font-medium text-slate-700">Active</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.is_featured}
                          onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                          className="w-4 h-4 accent-orange-500" />
                        <span className="text-sm font-medium text-slate-700">Featured</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">Product Images</p>
                    <button onClick={addImageRow}
                      className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition">
                      <PlusIcon className="w-3.5 h-3.5" /> Add Image
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 -mt-2">First image will be the primary image (shown in listings).</p>
                  {images.map((img, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl bg-slate-50">
                      <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
                        {img.image_url ? (
                          <img src={img.image_url} alt="" className="w-full h-full object-cover"
                            onError={e => { e.target.style.display = 'none'; }} />
                        ) : (
                          <PhotoIcon className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <input type="text" value={img.image_url}
                        onChange={e => updateImage(i, 'image_url', e.target.value)}
                        placeholder="Paste image URL here"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white" />
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {i === 0 && <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full">Primary</span>}
                        {images.length > 1 && (
                          <button onClick={() => removeImage(i)} className="p-1 text-slate-300 hover:text-red-400 transition">
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">Product Variants</p>
                    <button onClick={addVariantRow}
                      className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition">
                      <PlusIcon className="w-3.5 h-3.5" /> Add Variant
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 -mt-2">e.g. Color: Red, Size: XL, Storage: 128GB</p>
                  {variants.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                      <p className="text-sm text-slate-400">No variants yet</p>
                      <button onClick={addVariantRow} className="mt-2 text-xs font-bold text-orange-500 hover:text-orange-600">+ Add First Variant</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-5 gap-2 px-1">
                        {['Name', 'Value', 'Price +₹', 'Stock', 'SKU'].map(h => (
                          <p key={h} className="text-[10px] font-bold text-slate-400 uppercase">{h}</p>
                        ))}
                      </div>
                      {variants.map((v, i) => (
                        <div key={i} className="grid grid-cols-5 gap-2 items-center">
                          <input type="text" value={v.variant_name}
                            onChange={e => updateVariant(i, 'variant_name', e.target.value)}
                            placeholder="Color"
                            className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                          <input type="text" value={v.variant_value}
                            onChange={e => updateVariant(i, 'variant_value', e.target.value)}
                            placeholder="Red"
                            className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                          <input type="number" value={v.price_adjustment}
                            onChange={e => updateVariant(i, 'price_adjustment', e.target.value)}
                            placeholder="0"
                            className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                          <input type="number" value={v.stock_quantity}
                            onChange={e => updateVariant(i, 'stock_quantity', e.target.value)}
                            placeholder="0"
                            className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                          <div className="flex items-center gap-1">
                            <input type="text" value={v.sku}
                              onChange={e => updateVariant(i, 'sku', e.target.value)}
                              placeholder="SKU"
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
                            <button onClick={() => removeVariant(i)} className="p-1 text-slate-300 hover:text-red-400 transition flex-shrink-0">
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex-shrink-0 flex gap-3">
              {activeStep > 1 && (
                <button onClick={() => setActiveStep(s => s - 1)}
                  className="px-5 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                  ← Back
                </button>
              )}
              {activeStep < 3 ? (
                <button onClick={() => setActiveStep(s => s + 1)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-sm">
                  Next →
                </button>
              ) : (
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                  {saving ? (
                    <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Saving...</>
                  ) : editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsTab() {
  const metrics = [
    { label: 'Total Revenue',    value: '₹3,24,580', change: '12.4%', up: true,  icon: CurrencyRupeeIcon, accent: 'bg-orange-50 text-orange-500' },
    { label: 'Orders Fulfilled', value: '1,248',     change: '8.1%',  up: true,  icon: CheckCircleIcon,   accent: 'bg-green-50 text-green-500'   },
    { label: 'Avg Order Value',  value: '₹2,601',    change: '3.2%',  up: true,  icon: ChartBarIcon,      accent: 'bg-blue-50 text-blue-500'     },
    { label: 'Return Rate',      value: '1.8%',      change: '0.3%',  up: false, icon: ArrowPathIcon,     accent: 'bg-red-50 text-red-500'       },
    { label: 'Seller Rating',    value: '4.8 ★',     change: '0.2',   up: true,  icon: StarIcon,          accent: 'bg-yellow-50 text-yellow-500' },
    { label: 'Pending Payouts',  value: '₹18,200',   change: 'Due in 3 days', up: null, icon: CurrencyRupeeIcon, accent: 'bg-slate-50 text-slate-500' },
  ];
  const topProducts = [
    { name: 'Wireless Earbuds Pro X1',  sales: 312, revenue: '₹40,488', trend: '+18%' },
    { name: 'USB-C Hub 7-in-1',         sales: 198, revenue: '₹49,502', trend: '+12%' },
    { name: 'Mechanical Keyboard RGB',  sales: 143, revenue: '₹54,257', trend: '+9%'  },
    { name: 'LED Desk Lamp Adjustable', sales: 287, revenue: '₹25,813', trend: '+22%' },
    { name: 'Laptop Stand Premium',     sales: 174, revenue: '₹27,826', trend: '+6%'  },
  ];
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const values = [42, 58, 47, 73, 89, 95];
  const maxVal = Math.max(...values);

  return (
    <div>
      <SectionTitle sub="Your store performance at a glance">Performance Analytics</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
        {metrics.map(m => <StatCard key={m.label} {...m} />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Monthly Revenue Trend</h3>
            <Badge color="green">Last 6 months</Badge>
          </div>
          <div className="flex items-end gap-3 h-40">
            {months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-orange-500 rounded-t-lg hover:bg-orange-400 transition-all duration-500 cursor-pointer"
                  style={{ height: `${(values[i] / maxVal) * 100}%`, minHeight: 8 }} title={`₹${values[i]}k`} />
                <span className="text-[10px] text-slate-400 font-medium">{m}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-200 w-5 flex-shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.sales} units · {p.revenue}</p>
                </div>
                <Badge color="green">{p.trend}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const orders = [
    { id: '#BM-10452', customer: 'Rahul Sharma',  product: 'Wireless Earbuds Pro',    amount: '₹1,299', date: '24 Feb 2026', status: 'Delivered',  statusColor: 'green'  },
    { id: '#BM-10451', customer: 'Priya Singh',   product: 'USB-C Hub 7-in-1',        amount: '₹2,499', date: '23 Feb 2026', status: 'Shipped',    statusColor: 'blue'   },
    { id: '#BM-10450', customer: 'Amit Kumar',    product: 'Mechanical Keyboard RGB', amount: '₹3,799', date: '23 Feb 2026', status: 'Processing', statusColor: 'orange' },
    { id: '#BM-10449', customer: 'Sneha Patel',   product: 'LED Desk Lamp',           amount: '₹899',   date: '22 Feb 2026', status: 'Delivered',  statusColor: 'green'  },
    { id: '#BM-10448', customer: 'Vijay Mehta',   product: 'Laptop Stand',            amount: '₹1,599', date: '22 Feb 2026', status: 'Cancelled',  statusColor: 'red'    },
    { id: '#BM-10447', customer: 'Anita Rao',     product: 'Smart Watch Series 5',    amount: '₹4,999', date: '21 Feb 2026', status: 'Pending',    statusColor: 'slate'  },
    { id: '#BM-10446', customer: 'Deepak Verma',  product: 'Bluetooth Speaker',       amount: '₹2,199', date: '21 Feb 2026', status: 'Shipped',    statusColor: 'blue'   },
    { id: '#BM-10445', customer: 'Kavita Nair',   product: 'Wireless Mouse',          amount: '₹799',   date: '20 Feb 2026', status: 'Delivered',  statusColor: 'green'  },
  ];
  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <SectionTitle sub="Track and manage all your customer orders">Orders & Tracking</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: '1,248', icon: ClipboardDocumentListIcon, color: 'bg-blue-50 text-blue-500'    },
          { label: 'Pending',      value: '12',    icon: ClockIcon,                 color: 'bg-yellow-50 text-yellow-500'},
          { label: 'Shipped',      value: '38',    icon: TruckIcon,                 color: 'bg-orange-50 text-orange-500'},
          { label: 'Delivered',    value: '1,180', icon: CheckCircleIcon,           color: 'bg-green-50 text-green-500' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}><c.icon className="w-5 h-5" /></div>
            <div className="text-xl font-black text-slate-900">{c.value}</div>
            <div className="text-xs text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap mb-5">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === f ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Order ID', 'Customer', 'Product', 'Amount', 'Date', 'Status'].map(h => (
                <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-slate-400 text-sm">No orders found.</td></tr>
            ) : filtered.map(o => (
              <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm font-bold text-orange-500">{o.id}</td>
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">{o.customer}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{o.product}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{o.amount}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{o.date}</td>
                <td className="px-6 py-4"><Badge color={o.statusColor}>{o.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReturnsTab() {
  const returns = [
    { id: '#RET-001', order: '#BM-10440', product: 'Wireless Earbuds',    reason: 'Defective product',    amount: '₹1,299', date: '20 Feb', status: 'Approved',   statusColor: 'green'  },
    { id: '#RET-002', order: '#BM-10435', product: 'USB-C Hub',           reason: 'Wrong item delivered', amount: '₹2,499', date: '19 Feb', status: 'Pending',    statusColor: 'orange' },
    { id: '#RET-003', order: '#BM-10428', product: 'Mechanical Keyboard', reason: 'Not as described',     amount: '₹3,799', date: '18 Feb', status: 'Rejected',   statusColor: 'red'    },
    { id: '#RET-004', order: '#BM-10420', product: 'LED Desk Lamp',       reason: 'Changed mind',         amount: '₹899',   date: '17 Feb', status: 'Approved',   statusColor: 'green'  },
    { id: '#RET-005', order: '#BM-10415', product: 'Laptop Stand',        reason: 'Damaged in transit',   amount: '₹1,599', date: '16 Feb', status: 'Processing', statusColor: 'blue'   },
  ];

  return (
    <div>
      <SectionTitle sub="Manage customer return requests and refunds">Returns & Refunds</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Returns',  value: '24',      color: 'bg-slate-50 text-slate-500',  icon: ArrowPathIcon     },
          { label: 'Approved',       value: '18',      color: 'bg-green-50 text-green-500',  icon: CheckCircleIcon   },
          { label: 'Pending Review', value: '4',       color: 'bg-orange-50 text-orange-500',icon: ClockIcon         },
          { label: 'Refund Amount',  value: '₹28,400', color: 'bg-red-50 text-red-500',      icon: CurrencyRupeeIcon },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}><c.icon className="w-5 h-5" /></div>
            <div className="text-xl font-black text-slate-900">{c.value}</div>
            <div className="text-xs text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex gap-4 items-start">
        <ArrowPathIcon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-orange-800">BelkinMart Return Policy</p>
          <p className="text-xs text-orange-600 mt-1 leading-relaxed">Customers can initiate returns within 7 days of delivery. Approved returns will be deducted from your next settlement. Seller-fault returns are fully refunded to the customer.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Return ID', 'Order ID', 'Product', 'Reason', 'Amount', 'Date', 'Status'].map(h => (
                <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {returns.map(r => (
              <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm font-bold text-orange-500">{r.id}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{r.order}</td>
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">{r.product}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{r.reason}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{r.amount}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{r.date}</td>
                <td className="px-6 py-4"><Badge color={r.statusColor}>{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LogisticsTab() {
  const shipments = [
    { id: '#SHP-4521', order: '#BM-10451', customer: 'Priya Singh',  courier: 'Delhivery', tracking: 'DL8823491002', eta: '25 Feb', status: 'In Transit',      statusColor: 'blue'   },
    { id: '#SHP-4520', order: '#BM-10447', customer: 'Anita Rao',    courier: 'BlueDart',  tracking: 'BD7712830011', eta: '25 Feb', status: 'Out for Delivery', statusColor: 'orange' },
    { id: '#SHP-4519', order: '#BM-10446', customer: 'Deepak Verma', courier: 'DTDC',      tracking: 'DT9900234512', eta: '26 Feb', status: 'In Transit',      statusColor: 'blue'   },
    { id: '#SHP-4518', order: '#BM-10443', customer: 'Ravi Iyer',    courier: 'Delhivery', tracking: 'DL8812340021', eta: '24 Feb', status: 'Delivered',       statusColor: 'green'  },
    { id: '#SHP-4517', order: '#BM-10440', customer: 'Meena Das',    courier: 'Ekart',     tracking: 'EK2234510089', eta: '23 Feb', status: 'Delivered',       statusColor: 'green'  },
  ];
  const couriers = [
    { name: 'Delhivery', rate: '₹45/500g', cod: 'Yes', logo: '🚚' },
    { name: 'BlueDart',  rate: '₹65/500g', cod: 'Yes', logo: '💙' },
    { name: 'Ekart',     rate: '₹38/500g', cod: 'Yes', logo: '📦' },
    { name: 'DTDC',      rate: '₹42/500g', cod: 'No',  logo: '🏎️' },
  ];

  return (
    <div>
      <SectionTitle sub="Track shipments and manage courier partners">Logistics & Shipping</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Shipped',   value: '1,186', color: 'bg-blue-50 text-blue-500',   icon: TruckIcon       },
          { label: 'In Transit',      value: '38',    color: 'bg-orange-50 text-orange-500',icon: ClockIcon       },
          { label: 'Delivered Today', value: '12',    color: 'bg-green-50 text-green-500',  icon: CheckCircleIcon },
          { label: 'Failed Delivery', value: '3',     color: 'bg-red-50 text-red-500',      icon: XCircleIcon     },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}><c.icon className="w-5 h-5" /></div>
            <div className="text-xl font-black text-slate-900">{c.value}</div>
            <div className="text-xs text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-4">Available Courier Partners</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {couriers.map(c => (
          <div key={c.name} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:border-orange-200 transition text-center">
            <div className="text-3xl mb-3">{c.logo}</div>
            <div className="font-bold text-slate-900 mb-2">{c.name}</div>
            <div className="text-xs text-slate-500 space-y-1">
              <div>Rate: <span className="font-semibold text-slate-700">{c.rate}</span></div>
              <div>COD: <span className="font-semibold text-slate-700">{c.cod}</span></div>
            </div>
          </div>
        ))}
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-4">Active Shipments</h3>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
        <table className="w-full min-w-[750px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Shipment ID', 'Order', 'Customer', 'Courier', 'Tracking No.', 'ETA', 'Status'].map(h => (
                <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shipments.map(s => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm font-bold text-orange-500">{s.id}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{s.order}</td>
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">{s.customer}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.courier}</td>
                <td className="px-6 py-4 text-xs text-slate-400 font-mono">{s.tracking}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{s.eta}</td>
                <td className="px-6 py-4"><Badge color={s.statusColor}>{s.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KycTab() {
  const docs = [
    { title: 'GSTIN Certificate',      desc: 'Required for GST compliance and invoicing',      status: 'Verified',     statusColor: 'green',  icon: '📋' },
    { title: 'PAN Card',               desc: 'Personal or business PAN for tax deductions',    status: 'Verified',     statusColor: 'green',  icon: '🪪' },
    { title: 'Bank Account Details',   desc: 'For payment settlements every 7 days',           status: 'Verified',     statusColor: 'green',  icon: '🏦' },
    { title: 'Aadhaar / Voter ID',     desc: 'Government-issued ID for identity verification', status: 'Pending',      statusColor: 'orange', icon: '📄' },
    { title: 'Business Address Proof', desc: 'Utility bill or rent agreement (last 3 months)', status: 'Not Uploaded', statusColor: 'red',    icon: '🏢' },
    { title: 'Cancelled Cheque',       desc: 'Required to verify your bank account details',   status: 'Not Uploaded', statusColor: 'red',    icon: '✏️' },
  ];

  return (
    <div>
      <SectionTitle sub="Complete your KYC to unlock all seller features">Business Verification (KYC)</SectionTitle>
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-800">Verification Progress</span>
          <span className="text-sm font-bold text-orange-500">3 / 6 Completed</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full transition-all duration-700" style={{ width: '50%' }} />
        </div>
        <p className="text-xs text-slate-400 mt-2">Complete all steps to become a Verified Seller and unlock higher limits.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map(doc => (
          <div key={doc.title} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex gap-4 items-start hover:border-orange-200 transition">
            <div className="text-3xl flex-shrink-0">{doc.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <p className="font-bold text-sm text-slate-800">{doc.title}</p>
                <Badge color={doc.statusColor}>{doc.status}</Badge>
              </div>
              <p className="text-xs text-slate-500 mb-3">{doc.desc}</p>
              {doc.status !== 'Verified' ? (
                <button className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition">
                  <DocumentArrowUpIcon className="w-4 h-4" />Upload Document
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                  <CheckCircleIcon className="w-4 h-4" />Verified & Active
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportTab() {
  const tickets = [
    { id: '#TKT-001', subject: 'Payment not received for order #BM-10420', date: '22 Feb', status: 'Open',     statusColor: 'orange' },
    { id: '#TKT-002', subject: 'Product listing rejected without reason',   date: '20 Feb', status: 'Resolved', statusColor: 'green'  },
    { id: '#TKT-003', subject: 'Customer claiming wrong product delivered', date: '18 Feb', status: 'Open',     statusColor: 'orange' },
    { id: '#TKT-004', subject: 'Commission deducted incorrectly',           date: '15 Feb', status: 'Closed',   statusColor: 'slate'  },
  ];
  const faqs = [
    { q: 'How long does settlement take?',        a: 'Payments are settled every 7 days directly to your registered bank account after order delivery.' },
    { q: 'What is the commission structure?',     a: 'Commission ranges from 2.5% (Books) to 5% (Fashion) by category. No listing fees.' },
    { q: 'How do I handle a return request?',     a: 'Return requests appear in the Returns tab. You can approve or dispute within 48 hours.' },
    { q: 'Can I list across multiple categories?',a: 'Yes, list products across all approved categories from a single seller account.' },
    { q: 'How do I become a Gold Seller?',        a: 'Maintain rating above 4.5 and fulfill 500+ orders with less than 2% return rate.' },
  ];

  return (
    <div>
      <SectionTitle sub="Get help, raise tickets and find quick answers">Help Center & Support</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: PhoneIcon,          label: 'Call Support', sub: '+91 9415761434',           color: 'bg-green-50 text-green-600',  btn: 'Call Now'   },
          { icon: EnvelopeIcon,       label: 'Email Us',     sub: 'seller@belkinmart.in',     color: 'bg-blue-50 text-blue-600',    btn: 'Send Email' },
          { icon: ChatBubbleLeftIcon, label: 'Live Chat',    sub: 'Avg. response: 5 minutes', color: 'bg-orange-50 text-orange-600',btn: 'Start Chat' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-center hover:border-orange-200 transition">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${c.color}`}>
              <c.icon className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-800 text-sm">{c.label}</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">{c.sub}</p>
            <button className="w-full py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition">{c.btn}</button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">My Support Tickets</h3>
            <button className="text-xs font-bold text-orange-500 hover:text-orange-600 transition">+ Raise Ticket</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            {tickets.map((t, i) => (
              <div key={t.id} className={`p-5 hover:bg-slate-50 transition ${i < tickets.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-orange-500 mb-1">{t.id}</p>
                    <p className="text-sm text-slate-700 font-medium leading-snug">{t.subject}</p>
                    <p className="text-xs text-slate-400 mt-1">{t.date}</p>
                  </div>
                  <Badge color={t.statusColor}>{t.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm group">
                <summary className="px-5 py-4 text-sm font-semibold text-slate-800 cursor-pointer flex items-center justify-between list-none hover:text-orange-500 transition">
                  {f.q}
                  <span className="text-slate-300 group-open:text-orange-500 transition text-xl font-light ml-2 flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VendorDashboardPage() {
  const [activeTab,      setActiveTab]      = useState('overview');
  const [vendorName,     setVendorName]     = useState('');
  const [vendorType,     setVendorType]     = useState('');
  const [vendorInitials, setVendorInitials] = useState('');

  useEffect(() => {
    const vendorId = localStorage.getItem('vendor_id');
    if (!vendorId) return;
    supabase
      .from('vendors')
      .select('business_name, seller_type, contact_person_name')
      .eq('id', vendorId)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const displayName = data.contact_person_name || data.business_name || 'Vendor';
        const type        = data.seller_type         || 'Seller';
        const initials    = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        setVendorName(displayName);
        setVendorType(type);
        setVendorInitials(initials);
      });
  }, []);

  const menuItems = [
    { id: 'overview',  label: 'Dashboard',        icon: Squares2X2Icon,            section: 'Main'    },
    { id: 'products',  label: 'Product Manager',   icon: ShoppingBagIcon,           section: 'Main'    },
    { id: 'orders',    label: 'Orders & Tracking', icon: ClipboardDocumentListIcon, section: 'Main'    },
    { id: 'analytics', label: 'Performance',       icon: ChartBarIcon,              section: 'Main'    },
    { id: 'returns',   label: 'Returns & Refunds', icon: ArrowPathIcon,             section: 'Sales'   },
    { id: 'shipping',  label: 'Logistics',         icon: TruckIcon,                 section: 'Sales'   },
    { id: 'kyc',       label: 'Business KYC',      icon: ShieldCheckIcon,           section: 'Account' },
    { id: 'profile',   label: 'Store Settings',    icon: UserCircleIcon,            section: 'Account' },
    { id: 'support',   label: 'Help Center',       icon: QuestionMarkCircleIcon,    section: 'Account' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':  return <Overview />;
      case 'products':  return <ProductsTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'orders':    return <OrdersTab />;
      case 'returns':   return <ReturnsTab />;
      case 'shipping':  return <LogisticsTab />;
      case 'kyc':       return <KycTab />;
      case 'profile':   return <Profile />;
      case 'support':   return <SupportTab />;
      default:          return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <VendorHeader />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-[#1e293b] text-white hidden lg:flex flex-col flex-shrink-0">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl flex-shrink-0">BM</div>
              <div>
                <h2 className="text-lg font-bold leading-tight">Seller Panel</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">BelkinMart India</p>
              </div>
            </div>
          </div>
          <nav className="flex-grow overflow-y-auto p-4">
            {['Main', 'Sales', 'Account'].map(section => (
              <div key={section} className="mb-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase px-4 mb-2 tracking-widest">{section}</p>
                {menuItems.filter(item => item.section === section).map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 text-left ${activeTab === item.id ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={() => { localStorage.removeItem('vendor_id'); window.location.href = '/vendor/login'; }}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition text-sm">
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-grow flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b flex items-center justify-between px-8 flex-shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Seller</span>
              <span>/</span>
              <span className="font-semibold text-slate-900 capitalize">
                {menuItems.find(m => m.id === activeTab)?.label || activeTab}
              </span>
            </div>
            <div className="flex items-center gap-5">
              <div className="hidden md:flex flex-col items-end border-r pr-5">
                <span className="text-xs font-bold text-slate-900">{vendorName || '—'}</span>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 rounded-full font-bold uppercase">
                  {vendorType || 'Seller'}
                </span>
              </div>
              <button className="relative p-2 text-slate-400 hover:text-orange-500 transition">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-2 right-2 bg-red-500 w-2 h-2 rounded-full border-2 border-white" />
              </button>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold border text-sm">
                {vendorInitials || '?'}
              </div>
            </div>
          </header>

          <div className="flex-grow overflow-y-auto">
            <div className="p-6 lg:p-10">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </div>
            <VendorFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
 */

//

// components/vendor/VendorDashboard.jsx — Dynamic (Safe Version)
// src/pages/VendorDashboard.jsx
// Single-file vendor dashboard: all tabs + live Supabase data + Supabase Storage image upload

import React, { useState, useEffect } from 'react';
import {
  Squares2X2Icon, ShoppingBagIcon, ClipboardDocumentListIcon, UserCircleIcon,
  ArrowPathIcon, TruckIcon, BellIcon, ChartBarIcon, ShieldCheckIcon,
  QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon, ArrowUpIcon, ArrowDownIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon, CurrencyRupeeIcon, StarIcon,
  ChatBubbleLeftIcon, DocumentArrowUpIcon, PhoneIcon, EnvelopeIcon,
  PlusIcon, PencilIcon, TrashIcon, XMarkIcon, MagnifyingGlassIcon, PhotoIcon,
} from '@heroicons/react/24/outline';

import { supabase } from '../supabaseClient';
import VendorHeader from '../components/vendor/VendorHeader';
import VendorFooter from '../components/vendor/VendorFooter';
import Profile from '../components/vendor/VendorProfile';

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────

const fmtINR = (n) => {
  const num = parseFloat(n) || 0;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
  if (num >= 100000)   return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000)     return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
};

const safeFetch = async (queryPromise) => {
  try {
    const { data, error } = await queryPromise;
    if (error) { console.warn('Supabase:', error.message); return []; }
    return data || [];
  } catch (e) { console.warn('Fetch error:', e.message); return []; }
};

const Badge = ({ color, children }) => {
  const colors = {
    green:  'bg-green-50  text-green-700  border-green-200',
    red:    'bg-red-50    text-red-700    border-red-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    blue:   'bg-blue-50   text-blue-700   border-blue-200',
    slate:  'bg-slate-50  text-slate-600  border-slate-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
};

const StatCard = ({ label, value, change, up, icon: Icon, accent }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="text-2xl font-black text-slate-900">{value}</div>
    {change && up !== null && (
      <div className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-500'}`}>
        {up ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
        {change} vs last month
      </div>
    )}
    {change && up === null && <div className="text-xs font-semibold text-orange-500">{change}</div>}
  </div>
);

const SectionTitle = ({ children, sub }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{children}</h2>
    {sub && <p className="text-sm text-slate-500 mt-1">{sub}</p>}
  </div>
);

const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
  </div>
);

const statusBadgeColor = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'delivered')  return 'green';
  if (s === 'shipped')    return 'blue';
  if (s === 'processing') return 'orange';
  if (s === 'pending')    return 'yellow';
  if (s === 'cancelled')  return 'red';
  return 'slate';
};

// ─────────────────────────────────────────────
// Overview Tab — Live Supabase Data
// ─────────────────────────────────────────────

const BarChart = ({ labels, values, color = 'bg-orange-500', formatVal = String }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-2 h-32 w-full pt-6">
      {labels.map((label, i) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1.5 group">
          <div className="relative w-full flex items-end justify-center" style={{ height: 96 }}>
            <div
              className={`w-full ${color} rounded-t-md hover:opacity-75 transition-all duration-500 cursor-pointer relative`}
              style={{ height: `${Math.max((values[i] / max) * 100, 3)}%` }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {formatVal(values[i])}
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
};

function OverviewTab() {
  const [loading,       setLoading]       = useState(true);
  const [stats,         setStats]         = useState(null);
  const [recentOrders,  setRecentOrders]  = useState([]);
  const [topProducts,   setTopProducts]   = useState([]);
  const [chartData,     setChartData]     = useState({ labels: [], revenue: [], orders: [] });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const vendorId = localStorage.getItem('vendor_id');

    let pQ = supabase.from('products').select('id, is_active, stock_quantity');
    if (vendorId) pQ = pQ.eq('vendor_id', vendorId);
    const products       = await safeFetch(pQ);
    const activeProducts = products.filter(p => p.is_active).length;
    const lowStock       = products.filter(p => (p.stock_quantity ?? 0) <= 5).length;

    let oQ = supabase
      .from('orders')
      .select('id, total_amount, status, created_at, customer_name, customer_email, customer_phone')
      .order('created_at', { ascending: false });
    if (vendorId) oQ = oQ.eq('vendor_id', vendorId);
    const orders          = await safeFetch(oQ);
    const totalOrders     = orders.length;
    const pendingOrders   = orders.filter(o => ['pending','processing'].includes((o.status||'').toLowerCase())).length;
    const shippedOrders   = orders.filter(o => (o.status||'').toLowerCase() === 'shipped').length;
    const deliveredOrders = orders.filter(o => (o.status||'').toLowerCase() === 'delivered').length;
    const cancelledOrders = orders.filter(o => (o.status||'').toLowerCase() === 'cancelled').length;
    const totalRevenue    = orders.filter(o => (o.status||'').toLowerCase() !== 'cancelled')
                              .reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);
    const uniqueCustomers = new Set(
      orders.map(o => o.customer_email || o.customer_phone || o.customer_name).filter(Boolean)
    ).size;

    setRecentOrders(orders.slice(0, 5));

    const now = new Date();
    const monthLabels = [], monthRevenue = [], monthOrderCnt = [];
    for (let i = 5; i >= 0; i--) {
      const d     = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString();
      monthLabels.push(d.toLocaleString('en-IN', { month: 'short' }));
      const mo = orders.filter(o => o.created_at >= start && o.created_at <= end);
      monthOrderCnt.push(mo.length);
      monthRevenue.push(
        mo.filter(o => (o.status||'').toLowerCase() !== 'cancelled')
          .reduce((s, o) => s + parseFloat(o.total_amount || 0), 0)
      );
    }
    setChartData({ labels: monthLabels, revenue: monthRevenue, orders: monthOrderCnt });

    const thisMonth = monthRevenue[5] || 0;
    const lastMonth = monthRevenue[4] || 0;
    const revChange = lastMonth > 0 ? `${Math.abs(((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1)}%` : null;
    const revUp = thisMonth >= lastMonth;

    let iqQ = supabase.from('order_items').select('product_id, quantity, price, products(name)');
    if (vendorId) iqQ = iqQ.eq('vendor_id', vendorId);
    const orderItems = await safeFetch(iqQ);
    if (orderItems.length > 0) {
      const prodMap = {};
      orderItems.forEach(item => {
        const pid = item.product_id;
        if (!prodMap[pid]) prodMap[pid] = { name: item.products?.name || `Product #${pid}`, units: 0, revenue: 0 };
        prodMap[pid].units   += parseInt(item.quantity || 0);
        prodMap[pid].revenue += parseFloat(item.price || 0) * parseInt(item.quantity || 0);
      });
      setTopProducts(Object.values(prodMap).sort((a, b) => b.units - a.units).slice(0, 5));
    }

    setStats({ totalRevenue, totalOrders, activeProducts, uniqueCustomers, lowStock, pendingOrders, shippedOrders, deliveredOrders, cancelledOrders, revChange, revUp });
    setLoading(false);
  };

  if (loading) return <Spinner />;
  const s = stats || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Live store overview</p>
        </div>
        <button onClick={fetchAll}
          className="flex items-center gap-2 border border-slate-200 bg-white text-slate-600 hover:text-orange-500 hover:border-orange-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
          <ArrowPathIcon className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sales',     value: fmtINR(s.totalRevenue),                        icon: CurrencyRupeeIcon,         accent: 'bg-green-100 text-green-600',  change: s.revChange, up: s.revUp },
          { label: 'Total Orders',    value: (s.totalOrders||0).toLocaleString('en-IN'),     icon: ClipboardDocumentListIcon, accent: 'bg-blue-100 text-blue-600'    },
          { label: 'Active Products', value: s.activeProducts||0,                            icon: ShoppingBagIcon,           accent: 'bg-orange-100 text-orange-600' },
          { label: 'Customer Base',   value: (s.uniqueCustomers||0).toLocaleString('en-IN'), icon: UserCircleIcon,            accent: 'bg-purple-100 text-purple-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${c.accent}`}>
              <c.icon className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 font-medium mb-0.5">{c.label}</p>
              <p className="text-2xl font-black text-slate-900 leading-tight">{c.value}</p>
              {c.change != null && (
                <div className={`flex items-center gap-1 text-[11px] font-semibold mt-1 ${c.up ? 'text-green-600' : 'text-red-500'}`}>
                  {c.up ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                  {c.change} vs last month
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending / Processing', value: s.pendingOrders||0,   icon: ClockIcon,      color: 'bg-yellow-50 text-yellow-500' },
          { label: 'Shipped',              value: s.shippedOrders||0,   icon: TruckIcon,       color: 'bg-blue-50 text-blue-500'     },
          { label: 'Delivered',            value: s.deliveredOrders||0, icon: CheckCircleIcon, color: 'bg-green-50 text-green-500'   },
          { label: 'Cancelled',            value: s.cancelledOrders||0, icon: XCircleIcon,     color: 'bg-red-50 text-red-500'       },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}><c.icon className="w-5 h-5" /></div>
            <div className="text-xl font-black text-slate-900">{c.value.toLocaleString('en-IN')}</div>
            <div className="text-xs text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-800">Monthly Revenue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 months · excludes cancellations</p>
            </div>
            <span className="text-[11px] font-bold bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
              {fmtINR(chartData.revenue[5]||0)} this month
            </span>
          </div>
          {chartData.revenue.every(v => v === 0)
            ? <div className="flex items-center justify-center h-36 border-2 border-dashed border-slate-100 rounded-xl mt-4"><p className="text-sm text-slate-400">No revenue data yet</p></div>
            : <BarChart labels={chartData.labels} values={chartData.revenue} color="bg-orange-500" formatVal={fmtINR} />}
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-800">Monthly Orders</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 months · all statuses</p>
            </div>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
              {chartData.orders.reduce((a,b)=>a+b,0)} total
            </span>
          </div>
          {chartData.orders.every(v => v === 0)
            ? <div className="flex items-center justify-center h-36 border-2 border-dashed border-slate-100 rounded-xl mt-4"><p className="text-sm text-slate-400">No order data yet</p></div>
            : <BarChart labels={chartData.labels} values={chartData.orders} color="bg-blue-500" formatVal={v => `${v} orders`} />}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Orders</h3>
            <span className="text-xs text-slate-400">Latest 5</span>
          </div>
          {recentOrders.length === 0
            ? <div className="flex items-center justify-center py-12 text-slate-400 text-sm">No orders yet</div>
            : <div className="divide-y divide-slate-50">
                {recentOrders.map((o, idx) => (
                  <div key={o.id||idx} className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-orange-500">#{String(o.id).slice(0,8).toUpperCase()}</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{o.customer_name || o.customer_email || 'Customer'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900">{fmtINR(o.total_amount)}</p>
                      <p className="text-[10px] text-slate-400">
                        {o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short'}) : '—'}
                      </p>
                    </div>
                    <Badge color={statusBadgeColor(o.status)}>
                      {o.status ? o.status.charAt(0).toUpperCase()+o.status.slice(1) : 'Unknown'}
                    </Badge>
                  </div>
                ))}
              </div>}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Top Selling Products</h3>
            <span className="text-xs text-slate-400">By units sold</span>
          </div>
          {topProducts.length === 0
            ? <div className="flex flex-col items-center justify-center py-12 gap-1">
                <p className="text-slate-400 text-sm">No sales data yet</p>
                <p className="text-slate-300 text-xs">Appears once orders are placed</p>
              </div>
            : <div className="divide-y divide-slate-50">
                {topProducts.map((p, i) => {
                  const pct = Math.round((p.units / (topProducts[0]?.units||1)) * 100);
                  return (
                    <div key={i} className="px-6 py-3.5 hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-xs font-black text-slate-200 w-5 flex-shrink-0">#{i+1}</span>
                        <p className="text-sm font-semibold text-slate-800 truncate flex-1">{p.name}</p>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-slate-900">{p.units} units</p>
                          <p className="text-[10px] text-slate-400">{fmtINR(p.revenue)}</p>
                        </div>
                      </div>
                      <div className="ml-8 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full transition-all duration-700" style={{width:`${pct}%`}} />
                      </div>
                    </div>
                  );
                })}
              </div>}
        </div>
      </div>

      {(s.lowStock||0) > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
          <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Low Stock Alert</p>
            <p className="text-xs text-red-600 mt-1">{s.lowStock} product{s.lowStock>1?'s are':' is'} running low (≤5 units). Restock to avoid missed orders.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Products Tab — with Supabase Storage Upload
// ─────────────────────────────────────────────

const emptyProduct = { name:'',slug:'',description:'',short_description:'',price:'',discount_price:'',sku:'',stock_quantity:'',brand:'',condition:'new',warranty_period:'',is_active:true,is_featured:false,category_id:'' };
const emptyVariant = { variant_name:'',variant_value:'',price_adjustment:'',stock_quantity:'',sku:'' };
const emptyImage   = { image_url:'',is_primary:false,display_order:0 };

// ── SmartImage: shows image from blob URL (local) or any URL ──
// Uses blob URL (preview_url) when available — always works, no CORS issues.
// Falls back to image_url (Supabase public URL) for existing saved images.
function SmartImage({ src, previewSrc, className = "w-full h-full object-contain", size = "full" }) {
  const displaySrc = previewSrc || src;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [displaySrc]);

  if (!displaySrc) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 w-full h-full text-slate-300">
        <PhotoIcon className={size === 'sm' ? 'w-5 h-5' : 'w-10 h-10'} />
        {size !== 'sm' && <span className="text-xs text-slate-400">No image</span>}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <img
        key={displaySrc}
        src={displaySrc}
        alt="product"
        className={className}
        style={{ display: loaded ? 'block' : 'none' }}
        onLoad={() => setLoaded(true)}
        onError={() => { setFailed(true); setLoaded(false); }}
      />
      {!loaded && !failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
          <svg className="animate-spin h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-50">
          <XCircleIcon className="w-6 h-6 text-red-300" />
          {size !== 'sm' && <span className="text-xs text-red-400">Failed to load</span>}
        </div>
      )}
    </div>
  );
}

// Alias for table usage
function ImagePreview({ src, size = 'full' }) {
  return <SmartImage src={src} size={size} />;
}

// ── ImageUploadRow ──
// 3 states:
//   EMPTY  → big upload dropzone + paste URL input
//   BUSY   → uploading spinner
//   DONE   → full image preview, "Change" button on hover, NO URL shown
function ImageUploadRow({ img, index, isFirst, isUploading, uploadDisabled, canRemove, onRemove, onUrlChange, onFileSelect }) {
  const hasImage = !!(img.preview_url || img.image_url);

  return (
    <div className={`rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
      hasImage && !isUploading ? 'border-green-200 shadow-md bg-white'
      : isUploading             ? 'border-blue-200 bg-blue-50'
      :                           'border-slate-200 bg-slate-50'
    }`}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {isFirst
            ? <span className="text-[11px] bg-orange-100 text-orange-600 font-bold px-2.5 py-0.5 rounded-full">⭐ Primary</span>
            : <span className="text-[11px] text-slate-400 font-semibold">Image {index + 1}</span>
          }
          {isUploading && (
            <span className="flex items-center gap-1 text-[11px] text-blue-500 font-semibold">
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Saving...
            </span>
          )}
          {hasImage && !isUploading && (
            <span className="flex items-center gap-1 text-[11px] text-green-600 font-bold">
              <CheckCircleIcon className="w-3.5 h-3.5" /> Uploaded
            </span>
          )}
        </div>
        {canRemove && (
          <button onClick={onRemove} className="p-1 text-slate-300 hover:text-red-500 transition rounded-lg hover:bg-red-50">
            <XMarkIcon className="w-4 h-4"/>
          </button>
        )}
      </div>

      {/* BUSY: uploading */}
      {isUploading && (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-700">Uploading image...</p>
          <p className="text-xs text-slate-400">Saving to your store</p>
        </div>
      )}

      {/* DONE: show image full size, no URL clutter */}
      {hasImage && !isUploading && (
        <div className="relative group">
          <div className="w-full h-56 bg-slate-100">
            <SmartImage
              src={img.image_url}
              previewSrc={img.preview_url}
              className="w-full h-full object-contain"
            />
          </div>
          {/* Hover overlay with Change button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-200 opacity-0 group-hover:opacity-100">
            <label className="cursor-pointer flex items-center gap-2 bg-white text-slate-800 font-bold text-sm px-5 py-2.5 rounded-xl shadow-xl hover:bg-orange-500 hover:text-white transition-all">
              <ArrowPathIcon className="w-4 h-4" />
              Change Image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={uploadDisabled}
                onChange={e => { const f = e.target.files[0]; if (f) onFileSelect(f); e.target.value = ''; }}
              />
            </label>
          </div>
        </div>
      )}

      {/* EMPTY: upload UI */}
      {!hasImage && !isUploading && (
        <div className="p-4 space-y-3">
          <label className={`flex flex-col items-center justify-center gap-2.5 cursor-pointer w-full py-10 border-2 border-dashed rounded-xl transition-all
            ${uploadDisabled
              ? 'border-slate-200 text-slate-300 cursor-not-allowed'
              : 'border-orange-300 text-orange-500 hover:bg-orange-50 hover:border-orange-400 bg-white'
            }`}>
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
              <DocumentArrowUpIcon className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700">Click to upload</p>
              <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WEBP or GIF</p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploadDisabled}
              onChange={e => { const f = e.target.files[0]; if (f) onFileSelect(f); e.target.value = ''; }}
            />
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-slate-200"/>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-200"/>
          </div>
          <input
            type="text"
            value={img.image_url}
            onChange={e => onUrlChange(e.target.value)}
            placeholder="Paste image URL here..."
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white placeholder-slate-300"
          />
        </div>
      )}
    </div>
  );
}

function ProductsTab() {
  const [products,        setProducts]        = useState([]);
  const [categories,      setCategories]      = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [showModal,       setShowModal]       = useState(false);
  const [activeStep,      setActiveStep]      = useState(1);
  const [editingProduct,  setEditingProduct]  = useState(null);
  const [form,            setForm]            = useState(emptyProduct);
  const [variants,        setVariants]        = useState([]);
  const [images,          setImages]          = useState([{ ...emptyImage, is_primary:true }]);
  const [search,          setSearch]          = useState('');
  const [filterStatus,    setFilterStatus]    = useState('all');
  const [error,           setError]           = useState('');
  const [successMsg,      setSuccessMsg]      = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [productImages,   setProductImages]   = useState({});
  const [productVariants, setProductVariants] = useState({});
  const [uploadingIndex,  setUploadingIndex]  = useState(null); // ← NEW: tracks which image slot is uploading

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const vendorId = localStorage.getItem('vendor_id');
    let q = supabase.from('products').select('*, categories(name)').order('created_at', { ascending:false });
    if (vendorId) q = q.eq('vendor_id', vendorId);
    const { data, error:err } = await q;
    if (err) console.error('fetchProducts:', err.message);
    const prods = data || [];
    setProducts(prods);
    // Auto-load primary images for all products so table thumbnails always show
    if (prods.length > 0) {
      const ids = prods.map(p => p.id);
      const { data: imgs } = await supabase
        .from('product_images')
        .select('product_id, image_url, is_primary, display_order')
        .in('product_id', ids)
        .order('display_order');
      if (imgs) {
        const grouped = {};
        imgs.forEach(img => {
          if (!grouped[img.product_id]) grouped[img.product_id] = [];
          grouped[img.product_id].push(img);
        });
        setProductImages(prev => ({ ...prev, ...grouped }));
      }
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').eq('is_active', true);
    setCategories(data || []);
  };

  const fetchProductDetails = async (pid) => {
    if (productImages[pid] && productVariants[pid]) return;
    const [{ data:imgs }, { data:vars }] = await Promise.all([
      supabase.from('product_images').select('*').eq('product_id', pid).order('display_order'),
      supabase.from('product_variants').select('*').eq('product_id', pid),
    ]);
    setProductImages(p => ({ ...p, [pid]: imgs||[] }));
    setProductVariants(p => ({ ...p, [pid]: vars||[] }));
  };

  const toggleExpand = (pid) => {
    if (expandedProduct === pid) setExpandedProduct(null);
    else { setExpandedProduct(pid); fetchProductDetails(pid); }
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

  const openAddModal = () => {
    setEditingProduct(null); setForm(emptyProduct); setVariants([]);
    setImages([{...emptyImage,is_primary:true}]); setActiveStep(1); setError(''); setShowModal(true);
  };

  const openEditModal = async (product) => {
    setEditingProduct(product);
    setForm({
      name:product.name||'', slug:product.slug||'', description:product.description||'',
      short_description:product.short_description||'', price:product.price||'',
      discount_price:product.discount_price||'', sku:product.sku||'',
      stock_quantity:product.stock_quantity||'', brand:product.brand||'',
      condition:product.condition||'new', warranty_period:product.warranty_period||'',
      is_active:product.is_active??true, is_featured:product.is_featured??false,
      category_id:product.category_id||''
    });
    const [{ data:imgs }, { data:vars }] = await Promise.all([
      supabase.from('product_images').select('*').eq('product_id', product.id).order('display_order'),
      supabase.from('product_variants').select('*').eq('product_id', product.id),
    ]);
    setImages(imgs?.length ? imgs : [{...emptyImage,is_primary:true}]);
    setVariants(vars||[]); setActiveStep(1); setError(''); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product and all its images/variants?')) return;
    await Promise.all([
      supabase.from('product_images').delete().eq('product_id',id),
      supabase.from('product_variants').delete().eq('product_id',id)
    ]);
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
    setSuccessMsg('Product deleted.'); setTimeout(()=>setSuccessMsg(''),3000);
  };

  // ── Supabase Storage upload ──────────────────
  const uploadImageToSupabase = async (file, index) => {
    setUploadingIndex(index);
    setError('');

    // Create local blob URL for instant preview — works regardless of Supabase bucket policy
    const blobUrl = URL.createObjectURL(file);

    // Store blob URL for display + supabase URL for saving
    setImages(prev => prev.map((img, i) => i === index
      ? { ...img, image_url: blobUrl, preview_url: blobUrl }
      : img
    ));

    try {
      const vendorId = localStorage.getItem('vendor_id') || 'unknown';
      const ext      = file.name.split('.').pop().toLowerCase();
      const allowed  = ['jpg','jpeg','png','webp','gif'];
      if (!allowed.includes(ext)) {
        setError('Only JPG, PNG, WEBP, or GIF images are allowed.');
        setImages(prev => prev.map((img, i) => i === index ? { ...img, image_url: '', preview_url: '' } : img));
        URL.revokeObjectURL(blobUrl);
        setUploadingIndex(null);
        return;
      }

      const fileName = `${vendorId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);

      // Keep blob URL as preview_url (always visible), store public URL as image_url (for saving to DB)
      setImages(prev => prev.map((img, i) => i === index
        ? { ...img, image_url: data.publicUrl, preview_url: blobUrl }
        : img
      ));
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
      setImages(prev => prev.map((img, i) => i === index ? { ...img, image_url: '', preview_url: '' } : img));
      URL.revokeObjectURL(blobUrl);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim())    { setError('Product name is required.');   setActiveStep(1); return; }
    if (!form.price)          { setError('Price is required.');          setActiveStep(1); return; }
    if (!form.stock_quantity) { setError('Stock quantity is required.'); setActiveStep(1); return; }
    if (!form.category_id)   { setError('Please select a category.');   setActiveStep(1); return; }
    const validImages = images.filter(i => i.image_url?.trim());
    if (!validImages.length) { setError('Add at least one product image.'); setActiveStep(2); return; }

    setSaving(true); setError('');
    const vendorId = localStorage.getItem('vendor_id');
    const payload = {
      vendor_id:vendorId, name:form.name.trim(), slug:form.slug||generateSlug(form.name),
      description:form.description.trim(), short_description:form.short_description.trim(),
      price:parseFloat(form.price), discount_price:form.discount_price?parseFloat(form.discount_price):null,
      sku:form.sku.trim(), stock_quantity:parseInt(form.stock_quantity), brand:form.brand.trim(),
      condition:form.condition, warranty_period:form.warranty_period.trim(),
      is_active:form.is_active, is_featured:form.is_featured, category_id:form.category_id,
      updated_at:new Date().toISOString()
    };

    let productId = editingProduct?.id;
    if (editingProduct) {
      const { error:err } = await supabase.from('products').update(payload).eq('id', productId);
      if (err) { setError(err.message); setSaving(false); return; }
      await Promise.all([
        supabase.from('product_images').delete().eq('product_id',productId),
        supabase.from('product_variants').delete().eq('product_id',productId)
      ]);
    } else {
      payload.created_at = new Date().toISOString();
      const { data, error:err } = await supabase.from('products').insert(payload).select().single();
      if (err) { setError(err.message); setSaving(false); return; }
      productId = data.id;
    }

    await supabase.from('product_images').insert(
      validImages.map((img,idx) => ({
        product_id:productId, image_url:img.image_url.trim(),
        is_primary:idx===0, display_order:idx, created_at:new Date().toISOString()
      }))
    );

    const validVariants = variants.filter(v => v.variant_name?.trim() && v.variant_value?.trim());
    if (validVariants.length) {
      await supabase.from('product_variants').insert(
        validVariants.map(v => ({
          product_id:productId, variant_name:v.variant_name.trim(),
          variant_value:v.variant_value.trim(),
          price_adjustment:v.price_adjustment?parseFloat(v.price_adjustment):0,
          stock_quantity:v.stock_quantity?parseInt(v.stock_quantity):0,
          sku:v.sku?.trim()||'', created_at:new Date().toISOString()
        }))
      );
    }

    setSaving(false); setShowModal(false); setProductImages({}); setProductVariants({});
    setSuccessMsg(editingProduct?'Product updated!':'Product added!');
    setTimeout(()=>setSuccessMsg(''),3000); fetchProducts();
  };

  const toggleActive = async (id, current) => {
    await supabase.from('products').update({is_active:!current}).eq('id',id);
    setProducts(prev=>prev.map(p=>p.id===id?{...p,is_active:!current}:p));
  };

  const addVariantRow = () => setVariants(v=>[...v,{...emptyVariant}]);
  const removeVariant = (i) => setVariants(v=>v.filter((_,idx)=>idx!==i));
  const updateVariant = (i,f,val) => setVariants(v=>v.map((r,idx)=>idx===i?{...r,[f]:val}:r));
  const addImageRow   = () => setImages(v=>[...v,{...emptyImage,display_order:v.length}]);
  const removeImage   = (i) => setImages(v=>v.filter((_,idx)=>idx!==i));
  const updateImage   = (i,f,val) => setImages(v=>v.map((r,idx)=>idx===i?{...r,[f]:val}:r));

  const filtered = products.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku||'').toLowerCase().includes(search.toLowerCase());
    const mf = filterStatus==='all'?true:filterStatus==='active'?p.is_active:!p.is_active;
    return ms && mf;
  });

  const steps = ['Basic Info','Images','Variants'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Manager</h2>
          <p className="text-sm text-slate-500 mt-1">Add, edit and manage your product listings</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-orange-100">
          <PlusIcon className="w-4 h-4" /> Add Product
        </button>
      </div>

      {successMsg && <div className="mb-5 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">✅ {successMsg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Total Products', value:products.length,                                color:'bg-blue-50 text-blue-500',   icon:ShoppingBagIcon  },
          { label:'Active',         value:products.filter(p=>p.is_active).length,         color:'bg-green-50 text-green-500', icon:CheckCircleIcon  },
          { label:'Inactive',       value:products.filter(p=>!p.is_active).length,        color:'bg-slate-50 text-slate-500', icon:XCircleIcon      },
          { label:'Low Stock (≤5)', value:products.filter(p=>p.stock_quantity<=5).length, color:'bg-red-50 text-red-500',     icon:ClockIcon        },
        ].map(c=>(
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}><c.icon className="w-5 h-5"/></div>
            <div className="text-xl font-black text-slate-900">{c.value}</div>
            <div className="text-xs text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or SKU..." className="outline-none text-sm flex-1 text-slate-700 bg-transparent"/>
        </div>
        {['all','active','inactive'].map(s=>(
          <button key={s} onClick={()=>setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition capitalize ${filterStatus===s?'bg-orange-500 text-white':'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Product','Category','Price','Stock','SKU','Status','Actions'].map(h=>(
                  <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                  {products.length===0?'No products yet. Click "Add Product" to get started.':'No products match your search.'}
                </td></tr>
              ) : filtered.map(p=>(
                <React.Fragment key={p.id}>
                  <tr className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0 bg-slate-50 flex items-center justify-center shadow-sm">
                          <ImagePreview src={productImages[p.id]?.[0]?.image_url} size="sm" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 max-w-[180px] truncate">{p.name}</p>
                          {p.brand && <p className="text-xs text-slate-400">{p.brand}</p>}
                          {p.warranty_period && <p className="text-xs text-slate-300">Warranty: {p.warranty_period}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{p.categories?.name||'—'}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">₹{parseFloat(p.price).toLocaleString('en-IN')}</div>
                      {p.discount_price && <div className="text-xs text-green-600 font-semibold">₹{parseFloat(p.discount_price).toLocaleString('en-IN')} offer</div>}
                    </td>
                    <td className="px-6 py-4"><span className={`text-sm font-bold ${p.stock_quantity<=5?'text-red-500':'text-slate-800'}`}>{p.stock_quantity}</span></td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">{p.sku||'—'}</td>
                    <td className="px-6 py-4">
                      <button onClick={()=>toggleActive(p.id,p.is_active)}>
                        <Badge color={p.is_active?'green':'slate'}>{p.is_active?'Active':'Inactive'}</Badge>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>toggleExpand(p.id)} className="text-xs text-slate-400 hover:text-blue-500 transition font-medium">{expandedProduct===p.id?'Hide':'Details'}</button>
                        <button onClick={()=>openEditModal(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition"><PencilIcon className="w-4 h-4"/></button>
                        <button onClick={()=>handleDelete(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"><TrashIcon className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                  {expandedProduct===p.id && (
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-3">Product Images</p>
                            {!productImages[p.id] ? <p className="text-xs text-slate-400">Loading...</p>
                              : productImages[p.id].length===0 ? <p className="text-xs text-slate-400">No images added</p>
                              : <div className="flex flex-wrap gap-3">{productImages[p.id].map((img,i)=>(
                                  <div key={i} className="relative">
                                    <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shadow-sm">
                                      <ImagePreview src={img.image_url} />
                                    </div>
                                    {img.is_primary && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow">★</span>}
                                  </div>
                                ))}</div>}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-3">Variants</p>
                            {!productVariants[p.id] ? <p className="text-xs text-slate-400">Loading...</p>
                              : productVariants[p.id].length===0 ? <p className="text-xs text-slate-400">No variants added</p>
                              : <div className="space-y-2">{productVariants[p.id].map((v,i)=>(
                                  <div key={i} className="flex items-center gap-3 text-xs">
                                    <span className="font-semibold text-slate-700">{v.variant_name}: {v.variant_value}</span>
                                    {v.price_adjustment!==0 && <span className="text-green-600">+₹{v.price_adjustment}</span>}
                                    <span className="text-slate-400">Stock: {v.stock_quantity}</span>
                                    {v.sku && <span className="font-mono text-slate-300">{v.sku}</span>}
                                  </div>
                                ))}</div>}
                          </div>
                        </div>
                        {p.description && <div className="mt-4"><p className="text-xs font-bold text-slate-500 uppercase mb-1">Description</p><p className="text-xs text-slate-500 leading-relaxed">{p.description}</p></div>}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add / Edit Product Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-xl font-bold text-slate-800">{editingProduct?'Edit Product':'Add New Product'}</h3>
              <button onClick={()=>setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition"><XMarkIcon className="w-6 h-6"/></button>
            </div>
            {/* Step tabs */}
            <div className="flex border-b border-slate-100 flex-shrink-0">
              {steps.map((s,i)=>(
                <button key={s} onClick={()=>setActiveStep(i+1)}
                  className={`flex-1 py-3 text-sm font-semibold transition border-b-2 ${activeStep===i+1?'border-orange-500 text-orange-500':'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-2 ${activeStep===i+1?'bg-orange-500 text-white':'bg-slate-100 text-slate-500'}`}>{i+1}</span>{s}
                </button>
              ))}
            </div>
            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6">
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

              {/* ── Step 1: Basic Info ── */}
              {activeStep===1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name *</label>
                    <input type="text" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value,slug:generateSlug(e.target.value)}))} placeholder="Enter product name" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Slug</label>
                    <input type="text" value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))} placeholder="auto-generated" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-slate-50"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹) *</label>
                    <input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="0.00" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Price (₹)</label>
                    <input type="number" value={form.discount_price} onChange={e=>setForm(f=>({...f,discount_price:e.target.value}))} placeholder="0.00" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">SKU</label>
                    <input type="text" value={form.sku} onChange={e=>setForm(f=>({...f,sku:e.target.value}))} placeholder="SKU-001" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Stock Quantity *</label>
                    <input type="number" value={form.stock_quantity} onChange={e=>setForm(f=>({...f,stock_quantity:e.target.value}))} placeholder="0" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
                    <select value={form.category_id} onChange={e=>setForm(f=>({...f,category_id:e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white">
                      <option value="">Select category</option>
                      {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Brand</label>
                    <input type="text" value={form.brand} onChange={e=>setForm(f=>({...f,brand:e.target.value}))} placeholder="Brand name" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Condition</label>
                    <select value={form.condition} onChange={e=>setForm(f=>({...f,condition:e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white">
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Warranty Period</label>
                    <input type="text" value={form.warranty_period} onChange={e=>setForm(f=>({...f,warranty_period:e.target.value}))} placeholder="e.g. 1 Year" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Short Description</label>
                    <input type="text" value={form.short_description} onChange={e=>setForm(f=>({...f,short_description:e.target.value}))} placeholder="One-line summary" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                    <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Full product description" rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none"/>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.is_active} onChange={e=>setForm(f=>({...f,is_active:e.target.checked}))} className="w-4 h-4 accent-orange-500"/>
                      <span className="text-sm font-medium text-slate-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.is_featured} onChange={e=>setForm(f=>({...f,is_featured:e.target.checked}))} className="w-4 h-4 accent-orange-500"/>
                      <span className="text-sm font-medium text-slate-700">Featured</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ── Step 2: Images with Supabase Storage Upload ── */}
              {activeStep===2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Product Images</p>
                      <p className="text-xs text-slate-400 mt-0.5">First image will be the primary image.</p>
                    </div>
                    <button onClick={addImageRow} className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition border border-orange-200 px-3 py-1.5 rounded-lg">
                      <PlusIcon className="w-3.5 h-3.5"/> Add Image
                    </button>
                  </div>

                  {/* Info banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
                    <span className="text-blue-500 text-sm mt-0.5">💡</span>
                    <p className="text-xs text-blue-600 leading-relaxed">
                      Upload images directly from your device — they'll be saved to your store automatically. Or paste an external image URL.
                    </p>
                  </div>

                  {images.map((img, i) => (
                    <ImageUploadRow
                      key={i}
                      img={img}
                      index={i}
                      isFirst={i === 0}
                      isUploading={uploadingIndex === i}
                      uploadDisabled={uploadingIndex !== null}
                      canRemove={images.length > 1}
                      onRemove={() => removeImage(i)}
                      onUrlChange={val => updateImage(i, 'image_url', val)}
                      onFileSelect={file => uploadImageToSupabase(file, i)}
                    />
                  ))}
                </div>
              )}

              {/* ── Step 3: Variants ── */}
              {activeStep===3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Product Variants</p>
                      <p className="text-xs text-slate-400 mt-0.5">e.g. Color: Red, Size: XL</p>
                    </div>
                    <button onClick={addVariantRow} className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition border border-orange-200 px-3 py-1.5 rounded-lg">
                      <PlusIcon className="w-3.5 h-3.5"/> Add Variant
                    </button>
                  </div>
                  {variants.length===0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                      <p className="text-sm text-slate-400 mb-1">No variants yet</p>
                      <p className="text-xs text-slate-300 mb-3">Variants are optional — skip if your product has no size/color options</p>
                      <button onClick={addVariantRow} className="text-xs font-bold text-orange-500 hover:text-orange-600 border border-orange-200 px-4 py-2 rounded-lg">+ Add First Variant</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-5 gap-2 px-1">
                        {['Name','Value','Price +₹','Stock','SKU'].map(h=><p key={h} className="text-[10px] font-bold text-slate-400 uppercase">{h}</p>)}
                      </div>
                      {variants.map((v,i)=>(
                        <div key={i} className="grid grid-cols-5 gap-2 items-center">
                          <input type="text" value={v.variant_name} onChange={e=>updateVariant(i,'variant_name',e.target.value)} placeholder="Color" className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                          <input type="text" value={v.variant_value} onChange={e=>updateVariant(i,'variant_value',e.target.value)} placeholder="Red" className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                          <input type="number" value={v.price_adjustment} onChange={e=>updateVariant(i,'price_adjustment',e.target.value)} placeholder="0" className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                          <input type="number" value={v.stock_quantity} onChange={e=>updateVariant(i,'stock_quantity',e.target.value)} placeholder="0" className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                          <div className="flex items-center gap-1">
                            <input type="text" value={v.sku} onChange={e=>updateVariant(i,'sku',e.target.value)} placeholder="SKU" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 text-sm"/>
                            <button onClick={()=>removeVariant(i)} className="p-1 text-slate-300 hover:text-red-400 transition flex-shrink-0 hover:bg-red-50 rounded-lg"><XMarkIcon className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 flex-shrink-0 flex gap-3">
              {activeStep>1 && (
                <button onClick={()=>setActiveStep(s=>s-1)} className="px-5 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                  ← Back
                </button>
              )}
              {activeStep<3
                ? <button onClick={()=>setActiveStep(s=>s+1)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-sm">
                    Next →
                  </button>
                : <button onClick={handleSave} disabled={saving || uploadingIndex !== null}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                    {saving ? (
                      <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving...</>
                    ) : uploadingIndex !== null ? 'Uploading image...' : editingProduct ? 'Update Product' : 'Save Product'}
                  </button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Analytics Tab
// ─────────────────────────────────────────────
function AnalyticsTab() {
  const metrics = [
    { label:'Total Revenue',    value:'₹3,24,580', change:'12.4%', up:true,  icon:CurrencyRupeeIcon, accent:'bg-orange-50 text-orange-500' },
    { label:'Orders Fulfilled', value:'1,248',     change:'8.1%',  up:true,  icon:CheckCircleIcon,   accent:'bg-green-50 text-green-500'   },
    { label:'Avg Order Value',  value:'₹2,601',    change:'3.2%',  up:true,  icon:ChartBarIcon,      accent:'bg-blue-50 text-blue-500'     },
    { label:'Return Rate',      value:'1.8%',      change:'0.3%',  up:false, icon:ArrowPathIcon,     accent:'bg-red-50 text-red-500'       },
    { label:'Seller Rating',    value:'4.8 ★',     change:'0.2',   up:true,  icon:StarIcon,          accent:'bg-yellow-50 text-yellow-500' },
    { label:'Pending Payouts',  value:'₹18,200',   change:'Due in 3 days', up:null, icon:CurrencyRupeeIcon, accent:'bg-slate-50 text-slate-500' },
  ];
  const topProducts = [
    { name:'Wireless Earbuds Pro X1',  sales:312, revenue:'₹40,488', trend:'+18%' },
    { name:'USB-C Hub 7-in-1',         sales:198, revenue:'₹49,502', trend:'+12%' },
    { name:'Mechanical Keyboard RGB',  sales:143, revenue:'₹54,257', trend:'+9%'  },
    { name:'LED Desk Lamp Adjustable', sales:287, revenue:'₹25,813', trend:'+22%' },
    { name:'Laptop Stand Premium',     sales:174, revenue:'₹27,826', trend:'+6%'  },
  ];
  const months = ['Aug','Sep','Oct','Nov','Dec','Jan'];
  const values = [42,58,47,73,89,95];
  const maxVal = Math.max(...values);
  return (
    <div>
      <SectionTitle sub="Your store performance at a glance">Performance Analytics</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
        {metrics.map(m=><StatCard key={m.label} {...m}/>)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Monthly Revenue Trend</h3>
            <Badge color="green">Last 6 months</Badge>
          </div>
          <div className="flex items-end gap-3 h-40">
            {months.map((m,i)=>(
              <div key={m} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-orange-500 rounded-t-lg hover:bg-orange-400 transition-all duration-500 cursor-pointer" style={{height:`${(values[i]/maxVal)*100}%`,minHeight:8}} title={`₹${values[i]}k`}/>
                <span className="text-[10px] text-slate-400 font-medium">{m}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((p,i)=>(
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-200 w-5 flex-shrink-0">#{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.sales} units · {p.revenue}</p>
                </div>
                <Badge color="green">{p.trend}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Orders Tab
// ─────────────────────────────────────────────
function OrdersTab() {
  const [filter, setFilter] = useState('All');
  const filters = ['All','Pending','Processing','Shipped','Delivered','Cancelled'];
  const orders = [
    { id:'#BM-10452', customer:'Rahul Sharma',  product:'Wireless Earbuds Pro',    amount:'₹1,299', date:'24 Feb 2026', status:'Delivered',  statusColor:'green'  },
    { id:'#BM-10451', customer:'Priya Singh',   product:'USB-C Hub 7-in-1',        amount:'₹2,499', date:'23 Feb 2026', status:'Shipped',    statusColor:'blue'   },
    { id:'#BM-10450', customer:'Amit Kumar',    product:'Mechanical Keyboard RGB', amount:'₹3,799', date:'23 Feb 2026', status:'Processing', statusColor:'orange' },
    { id:'#BM-10449', customer:'Sneha Patel',   product:'LED Desk Lamp',           amount:'₹899',   date:'22 Feb 2026', status:'Delivered',  statusColor:'green'  },
    { id:'#BM-10448', customer:'Vijay Mehta',   product:'Laptop Stand',            amount:'₹1,599', date:'22 Feb 2026', status:'Cancelled',  statusColor:'red'    },
    { id:'#BM-10447', customer:'Anita Rao',     product:'Smart Watch Series 5',    amount:'₹4,999', date:'21 Feb 2026', status:'Pending',    statusColor:'slate'  },
    { id:'#BM-10446', customer:'Deepak Verma',  product:'Bluetooth Speaker',       amount:'₹2,199', date:'21 Feb 2026', status:'Shipped',    statusColor:'blue'   },
    { id:'#BM-10445', customer:'Kavita Nair',   product:'Wireless Mouse',          amount:'₹799',   date:'20 Feb 2026', status:'Delivered',  statusColor:'green'  },
  ];
  const filtered = filter==='All'?orders:orders.filter(o=>o.status===filter);
  return (
    <div>
      <SectionTitle sub="Track and manage all your customer orders">Orders & Tracking</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Total Orders', value:'1,248', icon:ClipboardDocumentListIcon, color:'bg-blue-50 text-blue-500'     },
          { label:'Pending',      value:'12',    icon:ClockIcon,                 color:'bg-yellow-50 text-yellow-500' },
          { label:'Shipped',      value:'38',    icon:TruckIcon,                 color:'bg-orange-50 text-orange-500' },
          { label:'Delivered',    value:'1,180', icon:CheckCircleIcon,           color:'bg-green-50 text-green-500'   },
        ].map(c=>(
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}><c.icon className="w-5 h-5"/></div>
            <div className="text-xl font-black text-slate-900">{c.value}</div>
            <div className="text-xs text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap mb-5">
        {filters.map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter===f?'bg-orange-500 text-white shadow-sm':'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}`}>{f}</button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Order ID','Customer','Product','Amount','Date','Status'].map(h=>(
                <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0
              ? <tr><td colSpan={6} className="text-center py-16 text-slate-400 text-sm">No orders found.</td></tr>
              : filtered.map(o=>(
                <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm font-bold text-orange-500">{o.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-medium">{o.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{o.product}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{o.amount}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{o.date}</td>
                  <td className="px-6 py-4"><Badge color={o.statusColor}>{o.status}</Badge></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Returns Tab
// ─────────────────────────────────────────────
function ReturnsTab() {
  const returns = [
    { id:'#RET-001', order:'#BM-10440', product:'Wireless Earbuds',    reason:'Defective product',    amount:'₹1,299', date:'20 Feb', status:'Approved',   statusColor:'green'  },
    { id:'#RET-002', order:'#BM-10435', product:'USB-C Hub',           reason:'Wrong item delivered', amount:'₹2,499', date:'19 Feb', status:'Pending',    statusColor:'orange' },
    { id:'#RET-003', order:'#BM-10428', product:'Mechanical Keyboard', reason:'Not as described',     amount:'₹3,799', date:'18 Feb', status:'Rejected',   statusColor:'red'    },
    { id:'#RET-004', order:'#BM-10420', product:'LED Desk Lamp',       reason:'Changed mind',         amount:'₹899',   date:'17 Feb', status:'Approved',   statusColor:'green'  },
    { id:'#RET-005', order:'#BM-10415', product:'Laptop Stand',        reason:'Damaged in transit',   amount:'₹1,599', date:'16 Feb', status:'Processing', statusColor:'blue'   },
  ];
  return (
    <div>
      <SectionTitle sub="Manage customer return requests and refunds">Returns & Refunds</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Total Returns',  value:'24',      color:'bg-slate-50 text-slate-500',  icon:ArrowPathIcon     },
          { label:'Approved',       value:'18',      color:'bg-green-50 text-green-500',  icon:CheckCircleIcon   },
          { label:'Pending Review', value:'4',       color:'bg-orange-50 text-orange-500',icon:ClockIcon         },
          { label:'Refund Amount',  value:'₹28,400', color:'bg-red-50 text-red-500',      icon:CurrencyRupeeIcon },
        ].map(c=>(
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}><c.icon className="w-5 h-5"/></div>
            <div className="text-xl font-black text-slate-900">{c.value}</div>
            <div className="text-xs text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex gap-4 items-start">
        <ArrowPathIcon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5"/>
        <div>
          <p className="text-sm font-bold text-orange-800">BelkinMart Return Policy</p>
          <p className="text-xs text-orange-600 mt-1 leading-relaxed">Customers can initiate returns within 7 days of delivery. Approved returns will be deducted from your next settlement. Seller-fault returns are fully refunded to the customer.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Return ID','Order ID','Product','Reason','Amount','Date','Status'].map(h=>(
                <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {returns.map(r=>(
              <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm font-bold text-orange-500">{r.id}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{r.order}</td>
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">{r.product}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{r.reason}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{r.amount}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{r.date}</td>
                <td className="px-6 py-4"><Badge color={r.statusColor}>{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Logistics Tab
// ─────────────────────────────────────────────
function LogisticsTab() {
  const shipments = [
    { id:'#SHP-4521', order:'#BM-10451', customer:'Priya Singh',  courier:'Delhivery', tracking:'DL8823491002', eta:'25 Feb', status:'In Transit',      statusColor:'blue'   },
    { id:'#SHP-4520', order:'#BM-10447', customer:'Anita Rao',    courier:'BlueDart',  tracking:'BD7712830011', eta:'25 Feb', status:'Out for Delivery', statusColor:'orange' },
    { id:'#SHP-4519', order:'#BM-10446', customer:'Deepak Verma', courier:'DTDC',      tracking:'DT9900234512', eta:'26 Feb', status:'In Transit',      statusColor:'blue'   },
    { id:'#SHP-4518', order:'#BM-10443', customer:'Ravi Iyer',    courier:'Delhivery', tracking:'DL8812340021', eta:'24 Feb', status:'Delivered',       statusColor:'green'  },
    { id:'#SHP-4517', order:'#BM-10440', customer:'Meena Das',    courier:'Ekart',     tracking:'EK2234510089', eta:'23 Feb', status:'Delivered',       statusColor:'green'  },
  ];
  const couriers = [
    { name:'Delhivery', rate:'₹45/500g', cod:'Yes', logo:'🚚' },
    { name:'BlueDart',  rate:'₹65/500g', cod:'Yes', logo:'💙' },
    { name:'Ekart',     rate:'₹38/500g', cod:'Yes', logo:'📦' },
    { name:'DTDC',      rate:'₹42/500g', cod:'No',  logo:'🏎️' },
  ];
  return (
    <div>
      <SectionTitle sub="Track shipments and manage courier partners">Logistics & Shipping</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Total Shipped',   value:'1,186', color:'bg-blue-50 text-blue-500',    icon:TruckIcon       },
          { label:'In Transit',      value:'38',    color:'bg-orange-50 text-orange-500', icon:ClockIcon       },
          { label:'Delivered Today', value:'12',    color:'bg-green-50 text-green-500',   icon:CheckCircleIcon },
          { label:'Failed Delivery', value:'3',     color:'bg-red-50 text-red-500',       icon:XCircleIcon     },
        ].map(c=>(
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}><c.icon className="w-5 h-5"/></div>
            <div className="text-xl font-black text-slate-900">{c.value}</div>
            <div className="text-xs text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-4">Available Courier Partners</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {couriers.map(c=>(
          <div key={c.name} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:border-orange-200 transition text-center">
            <div className="text-3xl mb-3">{c.logo}</div>
            <div className="font-bold text-slate-900 mb-2">{c.name}</div>
            <div className="text-xs text-slate-500 space-y-1">
              <div>Rate: <span className="font-semibold text-slate-700">{c.rate}</span></div>
              <div>COD: <span className="font-semibold text-slate-700">{c.cod}</span></div>
            </div>
          </div>
        ))}
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-4">Active Shipments</h3>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
        <table className="w-full min-w-[750px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Shipment ID','Order','Customer','Courier','Tracking No.','ETA','Status'].map(h=>(
                <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shipments.map(s=>(
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm font-bold text-orange-500">{s.id}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{s.order}</td>
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">{s.customer}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.courier}</td>
                <td className="px-6 py-4 text-xs text-slate-400 font-mono">{s.tracking}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{s.eta}</td>
                <td className="px-6 py-4"><Badge color={s.statusColor}>{s.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// KYC Tab
// ─────────────────────────────────────────────
function KycTab() {
  const docs = [
    { title:'GSTIN Certificate',      desc:'Required for GST compliance and invoicing',      status:'Verified',     statusColor:'green',  icon:'📋' },
    { title:'PAN Card',               desc:'Personal or business PAN for tax deductions',    status:'Verified',     statusColor:'green',  icon:'🪪' },
    { title:'Bank Account Details',   desc:'For payment settlements every 7 days',           status:'Verified',     statusColor:'green',  icon:'🏦' },
    { title:'Aadhaar / Voter ID',     desc:'Government-issued ID for identity verification', status:'Pending',      statusColor:'orange', icon:'📄' },
    { title:'Business Address Proof', desc:'Utility bill or rent agreement (last 3 months)', status:'Not Uploaded', statusColor:'red',    icon:'🏢' },
    { title:'Cancelled Cheque',       desc:'Required to verify your bank account details',   status:'Not Uploaded', statusColor:'red',    icon:'✏️' },
  ];
  return (
    <div>
      <SectionTitle sub="Complete your KYC to unlock all seller features">Business Verification (KYC)</SectionTitle>
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-800">Verification Progress</span>
          <span className="text-sm font-bold text-orange-500">3 / 6 Completed</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full transition-all duration-700" style={{width:'50%'}}/>
        </div>
        <p className="text-xs text-slate-400 mt-2">Complete all steps to become a Verified Seller and unlock higher limits.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map(doc=>(
          <div key={doc.title} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex gap-4 items-start hover:border-orange-200 transition">
            <div className="text-3xl flex-shrink-0">{doc.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <p className="font-bold text-sm text-slate-800">{doc.title}</p>
                <Badge color={doc.statusColor}>{doc.status}</Badge>
              </div>
              <p className="text-xs text-slate-500 mb-3">{doc.desc}</p>
              {doc.status!=='Verified'
                ? <button className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition"><DocumentArrowUpIcon className="w-4 h-4"/>Upload Document</button>
                : <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600"><CheckCircleIcon className="w-4 h-4"/>Verified & Active</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Support Tab
// ─────────────────────────────────────────────
function SupportTab() {
  const tickets = [
    { id:'#TKT-001', subject:'Payment not received for order #BM-10420', date:'22 Feb', status:'Open',     statusColor:'orange' },
    { id:'#TKT-002', subject:'Product listing rejected without reason',   date:'20 Feb', status:'Resolved', statusColor:'green'  },
    { id:'#TKT-003', subject:'Customer claiming wrong product delivered', date:'18 Feb', status:'Open',     statusColor:'orange' },
    { id:'#TKT-004', subject:'Commission deducted incorrectly',           date:'15 Feb', status:'Closed',   statusColor:'slate'  },
  ];
  const faqs = [
    { q:'How long does settlement take?',         a:'Payments are settled every 7 days directly to your registered bank account after order delivery.' },
    { q:'What is the commission structure?',      a:'Commission ranges from 2.5% (Books) to 5% (Fashion) by category. No listing fees.' },
    { q:'How do I handle a return request?',      a:'Return requests appear in the Returns tab. You can approve or dispute within 48 hours.' },
    { q:'Can I list across multiple categories?', a:'Yes, list products across all approved categories from a single seller account.' },
    { q:'How do I become a Gold Seller?',         a:'Maintain rating above 4.5 and fulfill 500+ orders with less than 2% return rate.' },
  ];
  return (
    <div>
      <SectionTitle sub="Get help, raise tickets and find quick answers">Help Center & Support</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon:PhoneIcon,          label:'Call Support', sub:'+91 9415761434',           color:'bg-green-50 text-green-600',  btn:'Call Now'   },
          { icon:EnvelopeIcon,       label:'Email Us',     sub:'seller@belkinmart.in',     color:'bg-blue-50 text-blue-600',    btn:'Send Email' },
          { icon:ChatBubbleLeftIcon, label:'Live Chat',    sub:'Avg. response: 5 minutes', color:'bg-orange-50 text-orange-600',btn:'Start Chat' },
        ].map(c=>(
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-center hover:border-orange-200 transition">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${c.color}`}><c.icon className="w-6 h-6"/></div>
            <p className="font-bold text-slate-800 text-sm">{c.label}</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">{c.sub}</p>
            <button className="w-full py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition">{c.btn}</button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">My Support Tickets</h3>
            <button className="text-xs font-bold text-orange-500 hover:text-orange-600 transition">+ Raise Ticket</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            {tickets.map((t,i)=>(
              <div key={t.id} className={`p-5 hover:bg-slate-50 transition ${i<tickets.length-1?'border-b border-slate-50':''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-orange-500 mb-1">{t.id}</p>
                    <p className="text-sm text-slate-700 font-medium leading-snug">{t.subject}</p>
                    <p className="text-xs text-slate-400 mt-1">{t.date}</p>
                  </div>
                  <Badge color={t.statusColor}>{t.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((f,i)=>(
              <details key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm group">
                <summary className="px-5 py-4 text-sm font-semibold text-slate-800 cursor-pointer flex items-center justify-between list-none hover:text-orange-500 transition">
                  {f.q}
                  <span className="text-slate-300 group-open:text-orange-500 transition text-xl font-light ml-2 flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page Shell
// ─────────────────────────────────────────────
export default function VendorDashboard() {
  const [activeTab,      setActiveTab]      = useState('overview');
  const [vendorName,     setVendorName]     = useState('');
  const [vendorType,     setVendorType]     = useState('');
  const [vendorInitials, setVendorInitials] = useState('');

  useEffect(() => {
    const vendorId = localStorage.getItem('vendor_id');
    if (!vendorId) return;
    supabase.from('vendors').select('business_name, seller_type, contact_person_name').eq('id', vendorId).single()
      .then(({ data }) => {
        if (!data) return;
        const displayName = data.contact_person_name || data.business_name || 'Vendor';
        const initials    = displayName.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
        setVendorName(displayName);
        setVendorType(data.seller_type || 'Seller');
        setVendorInitials(initials);
      });
  }, []);

  const menuItems = [
    { id:'overview',  label:'Dashboard',        icon:Squares2X2Icon,            section:'Main'    },
    { id:'products',  label:'Product Manager',   icon:ShoppingBagIcon,           section:'Main'    },
    { id:'orders',    label:'Orders & Tracking', icon:ClipboardDocumentListIcon, section:'Main'    },
    { id:'analytics', label:'Performance',       icon:ChartBarIcon,              section:'Main'    },
    { id:'returns',   label:'Returns & Refunds', icon:ArrowPathIcon,             section:'Sales'   },
    { id:'shipping',  label:'Logistics',         icon:TruckIcon,                 section:'Sales'   },
    { id:'kyc',       label:'Business KYC',      icon:ShieldCheckIcon,           section:'Account' },
    { id:'profile',   label:'Store Settings',    icon:UserCircleIcon,            section:'Account' },
    { id:'support',   label:'Help Center',       icon:QuestionMarkCircleIcon,    section:'Account' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':  return <OverviewTab />;
      case 'products':  return <ProductsTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'orders':    return <OrdersTab />;
      case 'returns':   return <ReturnsTab />;
      case 'shipping':  return <LogisticsTab />;
      case 'kyc':       return <KycTab />;
      case 'profile':   return <Profile />;
      case 'support':   return <SupportTab />;
      default:          return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <VendorHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-[#1e293b] text-white hidden lg:flex flex-col flex-shrink-0">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl flex-shrink-0">BM</div>
              <div>
                <h2 className="text-lg font-bold leading-tight">Seller Panel</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">BelkinMart India</p>
              </div>
            </div>
          </div>
          <nav className="flex-grow overflow-y-auto p-4">
            {['Main','Sales','Account'].map(section=>(
              <div key={section} className="mb-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase px-4 mb-2 tracking-widest">{section}</p>
                {menuItems.filter(item=>item.section===section).map(item=>(
                  <button key={item.id} onClick={()=>setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 text-left ${activeTab===item.id?'bg-orange-500 text-white shadow-md':'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <item.icon className="w-5 h-5 flex-shrink-0"/>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-700">
            <button onClick={()=>{localStorage.removeItem('vendor_id');window.location.href='/vendor/login';}}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition text-sm">
              <ArrowLeftOnRectangleIcon className="w-5 h-5"/>Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-grow flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b flex items-center justify-between px-8 flex-shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Seller</span><span>/</span>
              <span className="font-semibold text-slate-900 capitalize">{menuItems.find(m=>m.id===activeTab)?.label||activeTab}</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="hidden md:flex flex-col items-end border-r pr-5">
                <span className="text-xs font-bold text-slate-900">{vendorName||'—'}</span>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 rounded-full font-bold uppercase">{vendorType||'Seller'}</span>
              </div>
              <button className="relative p-2 text-slate-400 hover:text-orange-500 transition">
                <BellIcon className="w-6 h-6"/>
                <span className="absolute top-2 right-2 bg-red-500 w-2 h-2 rounded-full border-2 border-white"/>
              </button>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold border text-sm">
                {vendorInitials||'?'}
              </div>
            </div>
          </header>
          <div className="flex-grow overflow-y-auto">
            <div className="p-6 lg:p-10">
              <div className="max-w-7xl mx-auto">{renderContent()}</div>
            </div>
            <VendorFooter />
          </div>
        </main>
      </div>
    </div>
  );
}