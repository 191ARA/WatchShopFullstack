import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translationsadmin.json';
import { 
  adminFetchWatches, 
  adminCreateWatch, 
  adminUpdateWatch,
  adminDeleteWatch,
  adminFetchOrders,
  adminDeleteOrder,
  adminUpdateOrder,
  adminFetchUsers,
  adminUpdateUser,
  adminDeleteUser
} from '../api/admin';
import { logout } from '../store/authSlice';
import './AdminPanel.css';

function AdminPanel() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [activeTab, setActiveTab] = useState('watches');
  const [watches, setWatches] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Watch states
  const [newWatch, setNewWatch] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    stock: 1,
    description: '',
    imageUrl: ''
  });
  const [editingWatch, setEditingWatch] = useState(null);

  // User states
  const [editingUser, setEditingUser] = useState(null);

  // Order states
  const [editingOrder, setEditingOrder] = useState(null);

  // Search and sort states
  const [searchWatches, setSearchWatches] = useState('');
  const [sortConfigWatches, setSortConfigWatches] = useState({ key: null, direction: 'asc' });
  const [searchOrders, setSearchOrders] = useState('');
  const [sortConfigOrders, setSortConfigOrders] = useState({ key: null, direction: 'asc' });
  const [searchUsers, setSearchUsers] = useState('');
  const [sortConfigUsers, setSortConfigUsers] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          switch(activeTab) {
            case 'watches':
              const watchesData = await adminFetchWatches();
              setWatches(watchesData);
              break;
            case 'orders':
              const ordersData = await adminFetchOrders();
              setOrders(ordersData);
              break;
            case 'users':
              const usersData = await adminFetchUsers();
              setUsers(usersData);
              break;
            default:
              break;
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError(error.message || t.networkError);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [activeTab, user, t.networkError]);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Sorting handlers
  const handleSortWatches = (key) => {
    let direction = 'asc';
    if (sortConfigWatches.key === key && sortConfigWatches.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfigWatches({ key, direction });
  };

  const handleSortOrders = (key) => {
    let direction = 'asc';
    if (sortConfigOrders.key === key && sortConfigOrders.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfigOrders({ key, direction });
  };

  const handleSortUsers = (key) => {
    let direction = 'asc';
    if (sortConfigUsers.key === key && sortConfigUsers.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfigUsers({ key, direction });
  };

  // Filtered and sorted data
  const filteredAndSortedWatches = useMemo(() => {
    let filtered = watches.filter(watch => {
      const searchTerm = searchWatches.toLowerCase();
      return (
        watch.brand.toLowerCase().includes(searchTerm) ||
        watch.model.toLowerCase().includes(searchTerm) ||
        watch.year.toString().includes(searchTerm) ||
        watch.price.toString().includes(searchTerm) ||
        watch.stock.toString().includes(searchTerm) ||
        watch.description.toLowerCase().includes(searchTerm)
      );
    });

    if (sortConfigWatches.key) {
      filtered.sort((a, b) => {
        const valueA = a[sortConfigWatches.key];
        const valueB = b[sortConfigWatches.key];
        
        if (typeof valueA === 'string') {
          return sortConfigWatches.direction === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        return sortConfigWatches.direction === 'asc' 
          ? valueA - valueB
          : valueB - valueA;
      });
    }
    return filtered;
  }, [watches, searchWatches, sortConfigWatches]);

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const searchTerm = searchOrders.toLowerCase();
      return (
        order.id.toString().includes(searchTerm) ||
        order.user.name.toLowerCase().includes(searchTerm) ||
        order.watch.brand.toLowerCase().includes(searchTerm) ||
        order.watch.model.toLowerCase().includes(searchTerm) ||
        order.quantity.toString().includes(searchTerm) ||
        order.totalPrice.toString().includes(searchTerm) ||
        new Date(order.orderDate).toLocaleDateString().includes(searchTerm)
      );
    });

    if (sortConfigOrders.key) {
      filtered.sort((a, b) => {
        let valueA, valueB;
        
        switch(sortConfigOrders.key) {
          case 'user':
            valueA = a.user.name;
            valueB = b.user.name;
            break;
          case 'watch':
            valueA = a.watch.model;
            valueB = b.watch.model;
            break;
          case 'date':
            valueA = new Date(a.orderDate);
            valueB = new Date(b.orderDate);
            break;
          default:
            valueA = a[sortConfigOrders.key];
            valueB = b[sortConfigOrders.key];
        }

        if (typeof valueA === 'string') {
          return sortConfigOrders.direction === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        return sortConfigOrders.direction === 'asc' 
          ? valueA - valueB
          : valueB - valueA;
      });
    }
    return filtered;
  }, [orders, searchOrders, sortConfigOrders]);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const searchTerm = searchUsers.toLowerCase();
      return (
        user.id.toString().includes(searchTerm) ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
      );
    });

    if (sortConfigUsers.key) {
      filtered.sort((a, b) => {
        const valueA = a[sortConfigUsers.key];
        const valueB = b[sortConfigUsers.key];
        
        if (typeof valueA === 'string') {
          return sortConfigUsers.direction === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        return sortConfigUsers.direction === 'asc' 
          ? valueA - valueB
          : valueB - valueA;
      });
    }
    return filtered;
  }, [users, searchUsers, sortConfigUsers]);

  // Watch handlers
  const handleCreateWatch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const created = await adminCreateWatch(newWatch);
      setWatches([...watches, created]);
      setNewWatch({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        stock: 1,
        description: '',
        imageUrl: ''
      });
    } catch (error) {
      console.error('Create error:', error);
      setError(error.message || t.deleteWatchError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWatch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await adminUpdateWatch(editingWatch.id, editingWatch);
      setWatches(watches.map(w => w.id === updated.id ? updated : w));
      setEditingWatch(null);
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message || t.deleteWatchError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWatch = async (id) => {
    if (window.confirm(t.confirmDeleteWatch)) {
      setIsLoading(true);
      setError(null);
      try {
        await adminDeleteWatch(id);
        setWatches(watches.filter(w => w.id !== id));
      } catch (error) {
        console.error('Delete error:', error);
        setError(error.message || t.deleteWatchError);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // User handlers
  const handleUpdateUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await adminUpdateUser(editingUser.id, editingUser);
      setUsers(users.map(u => u.id === updated.id ? updated : u));
      setEditingUser(null);
    } catch (error) {
      console.error('User update error:', error);
      setError(error.message || t.deleteUserError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm(t.confirmDeleteUser)) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await adminDeleteUser(id);
        if (response.success) {
          setUsers(users.filter(u => u.id !== id));
        } else {
          setError(response.message || t.deleteUserError);
        }
      } catch (error) {
        console.error('Delete user error:', error);
        setError(t.networkError);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Order handlers
  const handleUpdateOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await adminUpdateOrder(editingOrder.id, editingOrder);
      setOrders(orders.map(o => o.id === updated.id ? updated : o));
      setEditingOrder(null);
    } catch (error) {
      console.error('Order update error:', error);
      setError(error.message || t.deleteOrderError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm(t.confirmDeleteOrder)) {
      setIsLoading(true);
      setError(null);
      try {
        await adminDeleteOrder(id);
        setOrders(orders.filter(o => o.id !== id));
      } catch (error) {
        console.error('Delete order error:', error);
        setError(t.deleteOrderError);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className={`admin-container ${theme}`}>
        <div className="admin-access-denied">
          <h2>{t.accessDenied}</h2>
          <p>{t.adminAccessRequired}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-container ${theme}`}>
      <div className="admin-header">
        <h1>{t.adminPanel}</h1>

      </div>

      {error && (
        <div className={`admin-error ${theme}`}>
          {error}
        </div>
      )}

      <div className="admin-tabs">
        <button 
          onClick={() => setActiveTab('watches')}
          className={`admin-tab ${activeTab === 'watches' ? 'active' : ''} ${theme}`}
        >
          {t.watches}
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''} ${theme}`}
        >
          {t.orders}
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''} ${theme}`}
        >
          {t.users}
        </button>
      </div>

      {isLoading && (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>{t.loading}</p>
        </div>
      )}

      {activeTab === 'watches' && (
        <div className="admin-section">
          <div className="admin-create-form">
            <h2>{t.addNewWatch}</h2>
            <div className="form-grid">
              <input
                type="text"
                placeholder={t.brand}
                value={newWatch.brand}
                onChange={(e) => setNewWatch({...newWatch, brand: e.target.value})}
                className={`form-input ${theme}`}
              />
              <input
                type="text"
                placeholder={t.model}
                value={newWatch.model}
                onChange={(e) => setNewWatch({...newWatch, model: e.target.value})}
                className={`form-input ${theme}`}
              />
              <input
                type="number"
                placeholder={t.year}
                value={newWatch.year}
                onChange={(e) => setNewWatch({...newWatch, year: parseInt(e.target.value)})}
                className={`form-input ${theme}`}
              />
              <input
                type="number"
                placeholder={t.price}
                value={newWatch.price}
                onChange={(e) => setNewWatch({...newWatch, price: parseFloat(e.target.value)})}
                className={`form-input ${theme}`}
              />
              <input
                type="number"
                placeholder={t.stock}
                value={newWatch.stock}
                onChange={(e) => setNewWatch({...newWatch, stock: parseInt(e.target.value)})}
                className={`form-input ${theme}`}
              />

              <button 
                onClick={handleCreateWatch}
                className={`admin-primary-btn ${theme}`}
                disabled={isLoading}
              >
                {t.add}
              </button>
            </div>
          </div>

          {editingWatch && (
            <div className={`admin-edit-form ${theme}`}>
              <h3>{t.editWatch}</h3>
              <div className="form-grid">
                <input
                  type="text"
                  value={editingWatch.brand}
                  onChange={(e) => setEditingWatch({...editingWatch, brand: e.target.value})}
                  className={`form-input ${theme}`}
                />
                <input
                  type="text"
                  value={editingWatch.model}
                  onChange={(e) => setEditingWatch({...editingWatch, model: e.target.value})}
                  className={`form-input ${theme}`}
                />
                <input
                  type="number"
                  value={editingWatch.year}
                  onChange={(e) => setEditingWatch({...editingWatch, year: parseInt(e.target.value)})}
                  className={`form-input ${theme}`}
                />
                <input
                  type="number"
                  value={editingWatch.price}
                  onChange={(e) => setEditingWatch({...editingWatch, price: parseFloat(e.target.value)})}
                  className={`form-input ${theme}`}
                />
                <input
                  type="number"
                  value={editingWatch.stock}
                  onChange={(e) => setEditingWatch({...editingWatch, stock: parseInt(e.target.value)})}
                  className={`form-input ${theme}`}
                />


                <div className="form-actions">
                  <button 
                    onClick={handleUpdateWatch}
                    className={`admin-primary-btn ${theme}`}
                    disabled={isLoading}
                  >
                    {t.save}
                  </button>
                  <button 
                    onClick={() => setEditingWatch(null)}
                    className={`admin-secondary-btn ${theme}`}
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </div>
          )}



          <h2>{t.watchList} ({filteredAndSortedWatches.length})</h2>
          <div className="watch-grid">
            {filteredAndSortedWatches.map(watch => (
              <div key={watch.id} className={`watch-card ${theme}`}>
                {watch.imageUrl && (
                  <img src={watch.imageUrl} alt={`${watch.brand} ${watch.model}`} className="watch-image" />
                )}
                <h3>{watch.brand} {watch.model}</h3>
                <p>{t.year}: {watch.year}</p>
                <p>{t.price}: {watch.price.toLocaleString()} ₸</p>
                <p>{t.stock}: {watch.stock}</p>
                {watch.description && (
                  <p className="watch-description">{watch.description}</p>
                )}
                <div className="watch-actions">
                  <button 
                    onClick={() => setEditingWatch({...watch})}
                    className={`admin-edit-btn ${theme}`}
                  >
                    {t.edit}
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-section">
          <div className="search-sort-container">
            <input
              type="text"
              placeholder={t.search}
              value={searchOrders}
              onChange={(e) => setSearchOrders(e.target.value)}
              className={`search-input ${theme}`}
            />
          </div>

          <h2>{t.orderManagement} ({filteredAndSortedOrders.length})</h2>
          
          {editingOrder && (
            <div className={`admin-edit-form ${theme}`}>
              <h3>{t.editOrder} #{editingOrder.id}</h3>
              <div className="order-edit-grid">
                <div>
                  <p><strong>{t.user}:</strong> {editingOrder.user.name}</p>
                  <p><strong>{t.watch}:</strong> {editingOrder.watch.brand} {editingOrder.watch.model}</p>
                  <p><strong>{t.currentAmount}:</strong> {editingOrder.totalPrice.toLocaleString()} ₸</p>
                </div>
                <div>
                  <label className={`form-label ${theme}`}>
                    {t.quantity}:
                    <input
                      type="number"
                      min="1"
                      value={editingOrder.quantity}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        quantity: parseInt(e.target.value),
                        totalPrice: editingOrder.watch.price * parseInt(e.target.value)
                      })}
                      className={`form-input ${theme}`}
                    />
                  </label>
                  <p><strong>{t.newAmount}:</strong> {editingOrder.watch.price * editingOrder.quantity} ₸</p>
                  <div className="form-actions">
                    <button 
                      onClick={handleUpdateOrder}
                      className={`admin-primary-btn ${theme}`}
                      disabled={isLoading}
                    >
                      {t.save}
                    </button>
                    <button 
                      onClick={() => setEditingOrder(null)}
                      className={`admin-secondary-btn ${theme}`}
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className={`admin-table ${theme}`}>
              <thead>
                <tr>
                  <th>
                    <button 
                      onClick={() => handleSortOrders('id')}
                      className="sortable-header"
                    >
                      ID {sortConfigOrders.key === 'id' && (
                        sortConfigOrders.direction === 'asc' ? '↑' : '↓'
                      )}
                    </button>
                  </th>
                  <th>
                    <button 
                      onClick={() => handleSortOrders('user')}
                      className="sortable-header"
                    >
                      {t.user} {sortConfigOrders.key === 'user' && (
                        sortConfigOrders.direction === 'asc' ? '↑' : '↓'
                      )}
                    </button>
                  </th>
                  <th>
                    <button 
                      onClick={() => handleSortOrders('watch')}
                      className="sortable-header"
                    >
                      {t.watch} {sortConfigOrders.key === 'watch' && (
                        sortConfigOrders.direction === 'asc' ? '↑' : '↓'
                      )}
                    </button>
                  </th>
                  <th>
                    <button 
                      onClick={() => handleSortOrders('quantity')}
                      className="sortable-header"
                    >
                      {t.quantity} {sortConfigOrders.key === 'quantity' && (
                        sortConfigOrders.direction === 'asc' ? '↑' : '↓'
                      )}
                    </button>
                  </th>
                  <th>
                    <button 
                      onClick={() => handleSortOrders('totalPrice')}
                      className="sortable-header"
                    >
                      {t.amount} {sortConfigOrders.key === 'totalPrice' && (
                        sortConfigOrders.direction === 'asc' ? '↑' : '↓'
                      )}
                    </button>
                  </th>
                  <th>
                    <button 
                      onClick={() => handleSortOrders('date')}
                      className="sortable-header"
                    >
                      {t.date} {sortConfigOrders.key === 'date' && (
                        sortConfigOrders.direction === 'asc' ? '↑' : '↓'
                      )}
                    </button>
                  </th>
                  <th>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user.name}</td>
                    <td>
                      {order.watch.brand} {order.watch.model}
                    </td>
                    <td>{order.quantity}</td>
                    <td>
                      {order.totalPrice.toLocaleString()} ₸
                    </td>
                    <td>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td>
                      <button 
                        onClick={() => setEditingOrder({...order})}
                        className={`admin-edit-btn ${theme}`}
                      >
                        {t.edit}
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className={`admin-delete-btn ${theme}`}
                      >
                        {t.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-section">


          <h2>{t.userManagement} ({filteredAndSortedUsers.length})</h2>
          
          {editingUser && (
            <div className={`admin-edit-form ${theme}`}>
              <h3>{t.editUser} #{editingUser.id}</h3>
              <div className="form-grid">
                <div>
                  <label className={`form-label ${theme}`}>
                    {t.name}:
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      className={`form-input ${theme}`}
                    />
                  </label>
                </div>
                <div>
                  <label className={`form-label ${theme}`}>
                    Email:
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      className={`form-input ${theme}`}
                    />
                  </label>
                </div>
                <div>
                  <label className={`form-label ${theme}`}>
                    {t.role}:
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                      className={`form-select ${theme}`}
                    >
                      <option value="user">{t.userRole}</option>
                      <option value="admin">{t.adminRole}</option>
                    </select>
                  </label>
                </div>
                <div className="form-actions">
                  <button 
                    onClick={handleUpdateUser}
                    className={`admin-primary-btn ${theme}`}
                    disabled={isLoading}
                  >
                    {t.save}
                  </button>
                  <button 
                    onClick={() => setEditingUser(null)}
                    className={`admin-secondary-btn ${theme}`}
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className={`admin-table ${theme}`}>
              <thead>
                <tr>
                  <th>
                    <button 
                      onClick={() => handleSortUsers('id')}
                      className="sortable-header"
                    >
                      ID {sortConfigUsers.key === 'id' && (
                        sortConfigUsers.direction === 'asc' ? '↑' : '↓'
                      )}
                    </button>
                  </th>
                  <th>
                    <button 
                      onClick={() => handleSortUsers('name')}
                      className="sortable-header"
                    >
                      {t.name} {sortConfigUsers.key === 'name' && (
                        sortConfigUsers.direction === 'asc' ? '↑' : '↓'
                      )}
                    </button>
                  </th>
                  <th>
                    <button 
                      onClick={() => handleSortUsers('email')}
                      className="sortable-header"
                    >
                      Email {sortConfigUsers.key === 'email' && (
                        sortConfigUsers.direction === 'asc' ? '↑' : '↓'
                      )}
                    </button>
                  </th>
                  <th>
                    <button 
                      onClick={() => handleSortUsers('role')}
                      className="sortable-header"
                    >
                      {t.role} {sortConfigUsers.key === 'role' && (
                        sortConfigUsers.direction === 'asc' ? '↑' : '↓'
                      )}
                    </button>
                  </th>
                  <th>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role === "admin" ? t.adminRole : t.userRole}</td>
                    <td>
                      <button
                        onClick={() => setEditingUser({...user})}
                        className={`admin-edit-btn ${theme}`}
                      >
                        {t.edit}
                      </button>
                 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;