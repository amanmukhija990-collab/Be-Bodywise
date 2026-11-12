import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { ProductImage } from '../components/ProductImage';
import { 
  Package, CheckCircle2, Truck, ArrowRight, RotateCcw, 
  ShoppingBag, ShieldCheck, ChevronRight, FileText, Download 
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { user, addToCart, setIsCartOpen, addToast } = useApp();

  // Mock verified orders for user
  const orders = [
    {
      id: 'BBW-94821',
      date: '02 Nov 2026',
      status: 'Delivered',
      deliveryDate: '05 Nov 2026',
      total: 1399,
      itemCount: 3,
      items: [
        {
          product: CATALOGUE_PRODUCTS.find(p => p.id === 'prod-hair-3') || CATALOGUE_PRODUCTS[0],
          quantity: 1,
          price: 699,
        },
        {
          product: CATALOGUE_PRODUCTS.find(p => p.id === 'prod-body-1') || CATALOGUE_PRODUCTS[1],
          quantity: 1,
          price: 349,
        },
        {
          product: CATALOGUE_PRODUCTS.find(p => p.id === 'prod-hair-gummies') || CATALOGUE_PRODUCTS[2],
          quantity: 1,
          price: 351,
        },
      ],
      shippingAddress: {
        name: user?.profile.firstName ? `${user.profile.firstName}` : 'Customer',
        line1: 'Flat 402, Green Glen Layout, Bellandur',
        city: 'Bengaluru, Karnataka - 560103',
        phone: '+91 98765 43210',
      },
    },
    {
      id: 'BBW-88104',
      date: '14 Oct 2026',
      status: 'Delivered',
      deliveryDate: '17 Oct 2026',
      total: 798,
      itemCount: 2,
      items: [
        {
          product: CATALOGUE_PRODUCTS.find(p => p.id === 'prod-body-3') || CATALOGUE_PRODUCTS[2],
          quantity: 2,
          price: 399,
        },
      ],
      shippingAddress: {
        name: user?.profile.firstName ? `${user.profile.firstName}` : 'Customer',
        line1: 'Flat 402, Green Glen Layout, Bellandur',
        city: 'Bengaluru, Karnataka - 560103',
        phone: '+91 98765 43210',
      },
    },
  ];

  const handleReorder = (items: { product: any; quantity: number }[]) => {
    items.forEach(item => {
      addToCart(item.product.id, item.quantity);
    });
    addToast('Items added to bag!', 'Your past order formulas have been loaded', 'success');
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#64748B] mb-6 font-sans">
          <Link to="/" className="hover:text-[#005995] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111827] font-semibold">Your Orders</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F5FF] border border-[#BADCF0] text-[#005995] font-mono text-[10px] font-bold tracking-wider uppercase mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>Verified Purchase History</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#111827]">
              Your Orders
            </h1>
            <p className="font-sans text-sm text-[#64748B] mt-1">
              Track active dispatches, view invoices, or easily reorder your personalized clinical formulas.
            </p>
          </div>

          <Link
            to="/shop/all"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#005995] text-white font-sans text-xs font-semibold hover:bg-[#004777] transition-all self-start sm:self-auto shadow-xs"
          >
            <span>Explore All Formulations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden transition-all hover:border-[#BADCF0]"
            >
              {/* Order Meta Bar */}
              <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6 text-[#64748B]">
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                      ORDER PLACED
                    </span>
                    <span className="font-medium text-[#111827]">{order.date}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                      TOTAL
                    </span>
                    <span className="font-mono font-bold text-[#111827]">₹{order.total}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                      SHIP TO
                    </span>
                    <span className="font-medium text-[#111827]">{order.shippingAddress.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#005995]">
                    #{order.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => addToast('Downloading invoice…', `Invoice for #${order.id} generated`, 'info')}
                    className="inline-flex items-center gap-1 text-[11px] text-[#64748B] hover:text-[#005995] font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-6 text-sm font-sans">
                  <div className="w-6 h-6 rounded-full bg-[#EDFCF5] text-[#198775] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-[#111827]">
                    {order.status} on {order.deliveryDate}
                  </span>
                  <span className="text-xs text-[#64748B] ml-1">
                    · Package was handed directly to resident
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-[#E2E8F0]/60">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                      <div className="w-18 h-18 rounded-2xl overflow-hidden bg-[#FAFBFD] border border-[#E2E8F0] shrink-0">
                        <ProductImage
                          src={item.product.image}
                          alt={item.product.name}
                          category={item.product.category}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-serif font-semibold text-sm sm:text-base text-[#111827] hover:text-[#005995] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="font-sans text-xs text-[#64748B] mt-0.5">
                          Qty: {item.quantity} · {item.product.sizeMl ? `${item.product.sizeMl}ml` : 'Standard Pack'}
                        </p>
                        <p className="font-mono text-xs font-bold text-[#005995] mt-1">
                          ₹{item.price}
                        </p>
                      </div>

                      <Link
                        to={`/product/${item.product.slug}`}
                        className="px-3.5 py-1.5 rounded-full border border-[#E2E8F0] text-xs font-medium text-[#111827] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors shrink-0"
                      >
                        View Item
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleReorder(order.items)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Buy Again</span>
                  </button>

                  <div className="flex items-center gap-4 text-xs font-sans text-[#64748B]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#198775]" />
                      <span>Authentic Doctor Formulation</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#005995]" />
                      <span>Free Doorstep Replacement</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
