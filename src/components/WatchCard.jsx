import { useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translations.json';
import { createOrder } from "../api/orders";
import './WatchCard.css';

function WatchCard({ watch }) {
  // Получаем пользователя из Redux store
  const user = useSelector((state) => state.auth.user);
  
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleOrder = async () => {
    if (!user) {
      setMessage(t.loginRequired1);
      return;
    }

    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Фейковая обработка платежа
    setTimeout(() => {
      setPaymentSuccess(true);
      
      // Фейковое создание заказа после успешной "оплаты"
      createOrder({
        userId: user.userId,
        watchId: watch.id,
        quantity: quantity,
      }).then(result => {
        if (result.success) {
          setMessage(t.orderSuccess);
        } else {
          setMessage(result.message || t.orderError);
        }
      }).catch(err => {
        setMessage(t.networkError1);
      });
      
      // Закрываем форму через 3 секунды
      setTimeout(() => {
        setShowPaymentForm(false);
        setPaymentSuccess(false);
      }, 3000);
    }, 1500);
  };

  const closePaymentForm = () => {
    setShowPaymentForm(false);
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setPaymentSuccess(false);
  };

  return (
    <div className={`watch-card ${theme}`}>
      <img
        src={`http://localhost:8080/images/${watch.id}.jpg`}
        alt={`${watch.brand} ${watch.model}`}
        className="watch-image"
      />

      <div className="watch-details">
        <h3 className="watch-title">{watch.brand} — {watch.model}</h3>
        <p className="watch-info">{t.year}: <strong>{watch.year}</strong></p>
        <p className="watch-info">{t.price}: <strong>{watch.price.toLocaleString()} ₸</strong></p>
        <p className="watch-info">{t.stock}: <strong>{watch.stock}</strong></p>
      </div>

      {user && (
        <div className="order-controls">
          <label className="quantity-label">
            {t.quantity}:
            <input
              type="number"
              min={1}
              max={watch.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={`quantity-input ${theme}`}
            />
          </label>
          <button
            onClick={handleOrder}
            className={`order-button ${theme}`}
          >
            {t.placeOrder}
          </button>
        </div>
      )}

      {message && (
        <p className={`order-message ${paymentSuccess ? 'success' : 'error'}`}>
          {message}
        </p>
      )}

      {showPaymentForm && (
        <div className="payment-modal">
          <div className={`payment-form ${theme}`}>
            {paymentSuccess ? (
              <div className="payment-success">
                <h3>{t.paymentSuccess}</h3>
                <p>{t.thankYou}</p>
              </div>
            ) : (
              <>
                <h3 className="payment-title">{t.paymentTitle}</h3>
                <p className="payment-amount">
                  {t.amountToPay}: <strong>{(watch.price * quantity).toLocaleString()} ₸</strong>
                </p>
                
                <form onSubmit={handlePaymentSubmit} className="payment-fields">
                  <div className="form-group">
                    <label>{t.cardNumber}</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className={`payment-input ${theme}`}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.expiryDate}</label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        className={`payment-input ${theme}`}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        className={`payment-input ${theme}`}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="payment-actions">
                    <button
                      type="button"
                      onClick={closePaymentForm}
                      className={`payment-button cancel ${theme}`}
                    >
                      {t.cancel}
                    </button>
                    
                    <button
                      type="submit"
                      className={`payment-button submit ${theme}`}
                    >
                      {t.pay}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WatchCard;