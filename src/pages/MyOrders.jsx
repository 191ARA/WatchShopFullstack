import { useEffect, useState } from "react";
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translations.json';
import './MyOrders.css';

function MyOrders() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setMessage(t.loginRequired);
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.userId;

    setIsLoading(true);
    fetch("http://localhost:8080/api/admin/orders")
      .then((res) => {
        if (!res.ok) throw new Error(t.ordersLoadError);
        return res.json();
      })
      .then((data) => {
        const userOrders = data.filter((order) => order.user.id === userId);
        setOrders(userOrders);
        if (userOrders.length === 0) {
          setMessage(t.noOrders);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage(t.networkError);
      })
      .finally(() => setIsLoading(false));
  }, [t]);

  if (isLoading) {
    return (
      <div className={`loading-container ${theme}`}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (message && orders.length === 0) {
    return (
      <div className={`message-container ${theme}`}>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className={`orders-container ${theme}`}>
      <h2 className="orders-title">{t.myOrders1}</h2>
      
      {orders.length === 0 ? (
        <p className={`no-orders-message ${theme}`}>{t.noOrders}</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className={`order-card ${theme}`}>
              <img
                src={`http://localhost:8080/images/${order.watch.id}.jpg`}
                alt={order.watch.model}
                className="order-image"
              />

              <div className="order-details">
                <h3 className="order-model">
                  {order.watch.brand} — {order.watch.model}
                </h3>

                <div className="order-info">
                  <p>
                    <span>{t.quantity}:</span> 
                    <strong>{order.quantity}</strong>
                  </p>
                  <p>
                    <span>{t.total}:</span> 
                    <strong>{order.totalPrice.toLocaleString()} ₸</strong>
                  </p>
                  <p>
                    <span>{t.date}:</span> 
                    <strong>{new Date(order.orderDate).toLocaleDateString(language)}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;