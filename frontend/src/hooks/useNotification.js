 import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../store/api';

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
        const countRes = await api.get('/notifications/unread-count');
        setUnreadCount(countRes.data.count);
      } catch (error) {}
    };
    fetchNotifications();
  }, []);
  
  const showToast = (message, type = 'success') => {
    if (type === 'success') toast.success(message);
    else if (type === 'error') toast.error(message);
    else toast(message);
  };
  
  return { notifications, unreadCount, showToast };
};

export default useNotification;
