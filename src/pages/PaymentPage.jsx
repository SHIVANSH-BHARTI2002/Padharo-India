/* === Filename: src/pages/PaymentPage.jsx === */
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiCreateBooking } from '../apiService';
import bannerImg from '../assets/cta-background.jpg';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Booking details are expected to be passed via navigation state from the details page
  const booking = location.state || {};

  const [method, setMethod] = useState('card'); // 'cash' | 'card'
  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Compute payable per service type
  const payable = useMemo(() => {
    if (booking?.service_type === 'Hotel') {
      const nightly = Number(booking?.nightly_price || 0);
      const start = booking?.start_date ? new Date(booking.start_date) : null;
      const end = booking?.end_date ? new Date(booking.end_date) : null;
      if (!nightly || !start || !end || end <= start) return 0;
      const diffMs = end.getTime() - start.getTime();
      const nights = Math.ceil(diffMs / (1000 * 3600 * 24));
      return nightly * nights;
    }
    if (booking?.service_type === 'Package') {
      const uiTotal = Number(booking?.ui_total_price || 0);
      const pkgPrice = Number(booking?.package_price || 0);
      const guests = Number(booking?.num_guests || 1);
      return uiTotal || (pkgPrice ? pkgPrice * guests : 0);
    }
    // Guide (and existing flow): price_per_hour * num_hours
    const pph = Number(booking?.price_per_hour || 0);
    const hrs = Number(booking?.num_hours || 0);
    if (!pph || !hrs) return 0;
    return pph * hrs;
  }, [booking]);

  // Pricing summary
  const taxRate = 0.09; // 9% tax
  const subtotalAmount = payable;
  const taxAmount = Math.round(subtotalAmount * taxRate);
  const totalAmount = Math.max(0, subtotalAmount + taxAmount);

  const validateCard = () => {
    // Minimal client-side validation for demo purposes
    const numOk = /^\d{16}$/.test(card.number.replace(/\s+/g, ''));
    const expOk = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(card.expiry);
    const cvvOk = /^\d{3}$/.test(card.cvv);
    const nameOk = card.name.trim().length >= 2;
    return numOk && expOk && cvvOk && nameOk;
  };

  const handleCompletePayment = async () => {
    setError('');
    setSuccessMsg('');

    if (!booking?.service_type || !booking?.service_id || !booking?.start_date) {
      setError('Missing booking details. Please go back and try again.');
      return;
    }

    if (method === 'card' && !validateCard()) {
      setError('Please enter valid card details.');
      return;
    }

    try {
      setSubmitting(true);
      let payload;
      if (booking.service_type === 'Hotel') {
        if (!booking?.room_id || !booking?.end_date) {
          setError('Missing room or dates for hotel booking.');
          setSubmitting(false);
          return;
        }
        payload = {
          service_type: 'Hotel',
          service_id: booking.service_id,
          room_id: booking.room_id,
          start_date: booking.start_date,
          end_date: booking.end_date,
          num_guests: booking.num_guests || 1,
          total_price: payable,
          payment_method: method,
        };
      } else if (booking.service_type === 'Package') {
        if (!booking?.start_date) {
          setError('Missing date for package booking.');
          setSubmitting(false);
          return;
        }
        payload = {
          service_type: 'Package',
          service_id: booking.service_id,
          start_date: booking.start_date,
          num_guests: booking.num_guests || 1,
          total_price: Number(booking.package_price || 0),
          payment_method: method,
        };
      } else {
        // Guide (original flow)
        payload = {
          service_type: booking.service_type,
          service_id: booking.service_id,
          start_date: booking.start_date,
          end_date: null,
          num_hours: booking.num_hours,
          total_price: payable,
          payment_method: method,
        };
      }

      const res = await apiCreateBooking(payload);
      setSuccessMsg(res?.message || 'Booking completed successfully');

      // Navigate to profile or a confirmation page after success
      setTimeout(() => {
        navigate('/profile');
      }, 1200);
    } catch (err) {
      setError(err?.message || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Simple fallback content when state is missing
  if (!booking?.service_id) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Payment</h1>
        <p className="text-gray-700 mb-6">No booking data found. Please return to the details page and try again.</p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/guides')} className="px-4 py-2 bg-amber-500 text-white rounded">Back to Guides</button>
          <button onClick={() => navigate('/hotels')} className="px-4 py-2 bg-amber-600 text-white rounded">Back to Hotels</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Banner */}
      <div className="relative mb-6">
        <div
          className="h-40 md:h-56 bg-cover bg-center rounded-2xl"
          style={{ backgroundImage: `url(${bannerImg})` }}
        />
      </div>
      <h1 className="text-2xl font-bold mb-4">Select Payment Option</h1>
      <p className="text-sm text-gray-600 mb-6">All transactions are secure and encrypted</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Payment options */}
        <div>
          {/* Credit Card */}
          <div className={`border rounded-xl p-4 mb-4 bg-white shadow-sm ${method === 'card' ? 'ring-2 ring-amber-500' : ''}`}>
            <label className="flex items-center gap-3 cursor-pointer" onClick={() => setMethod('card')}>
              <input type="radio" name="payment" checked={method === 'card'} onChange={() => setMethod('card')} />
              <span className="font-medium">Credit card</span>
            </label>
            <p className="text-xs text-gray-600 mt-2">Pay securely using your Visa, Maestro, Discover, or American Express card.</p>
            {method === 'card' && (
              <div className="mt-4 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Card name"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                    className="border rounded-md px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="MM / YY"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    className="border rounded-md px-3 py-2"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    className="border rounded-md px-3 py-2"
                  />
                </div>
                <p className="text-xs text-gray-500">This is a demo payment. No real charges applied.</p>
              </div>
            )}
          </div>

          {/* Google Pay removed as requested */}

          {/* Cash */}
          <div className={`border rounded-xl p-4 bg-white shadow-sm ${method === 'cash' ? 'ring-2 ring-amber-500' : ''}`}>
            <label className="flex items-center justify-between cursor-pointer" onClick={() => setMethod('cash')}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" checked={method === 'cash'} onChange={() => setMethod('cash')} />
                <span className="font-medium">Cash</span>
              </div>
              <span className="text-sm text-gray-500">Cash</span>
            </label>
          </div>

          {/* Errors / success messages */}
          {error && <div className="text-red-600 mt-3">{error}</div>}
          {successMsg && <div className="text-green-700 mt-3">{successMsg}</div>}

          {/* Agree and Pay button */}
          <div className="mt-4">
            <button
              onClick={handleCompletePayment}
              disabled={submitting || totalAmount <= 0}
              className={`w-full py-3 rounded-lg text-white font-semibold ${submitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {submitting ? 'Processing…' : `Pay | ₹${Number(totalAmount || 0).toLocaleString()}`}
            </button>
            <p className="mt-2 text-xs text-gray-600">By clicking this, you agree to our Terms & Conditions and Privacy Policy</p>
          </div>
        </div>

        {/* Right: Billing details */}
        <aside className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Billing details</h2>
          </div>

          {/* Single booking item */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow mb-4">
            <div className="h-16 w-16 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {booking.hotel_name || booking.guide_name || booking.package_name || booking.service_type}
              </p>
            </div>
            <p className="font-semibold">₹{Number(subtotalAmount || 0).toLocaleString()}</p>
          </div>

          {/* Order summary */}
          <div className="border-t pt-4 space-y-2 text-gray-700">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{Number(subtotalAmount || 0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{Number(taxAmount || 0).toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>₹{Number(totalAmount || 0).toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PaymentPage;