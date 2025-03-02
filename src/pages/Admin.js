import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const AdminContainer = styled.div`
  padding: 100px 20px 50px;
  max-width: 1200px;
  margin: 0 auto;
  direction: rtl;
`;

const PageTitle = styled(motion.h1)`
  font-size: 48px;
  margin-bottom: 20px;
  text-align: center;
  color: ${props => props.theme.colors.primary};
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 15px;
  text-align: right;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${props => props.theme.colors.light};
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #eee;
`;

const NoAccess = styled.div`
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const BookingsSection = styled.div`
  margin-top: 50px;
`;

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is admin
    if (!currentUser || currentUser.email !== 'elbazsteam@gmail.com') {
      navigate('/');
      return;
    }
    
    // Get users from Firestore
    const fetchUsers = async () => {
      try {
        const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(usersQuery);
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    // Get bookings from Firestore
    const fetchBookings = async () => {
      try {
        const bookingsQuery = query(collection(db, 'bookings'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(bookingsQuery);
        const bookingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    
    fetchUsers();
    fetchBookings();
  }, [currentUser, navigate]);
  
  if (!currentUser || currentUser.email !== 'elbazsteam@gmail.com') {
    return (
      <AdminContainer>
        <NoAccess>
          <h2>אין לך גישה לדף זה</h2>
          <p>רק מנהל מערכת יכול לצפות בנתוני המשתמשים.</p>
        </NoAccess>
      </AdminContainer>
    );
  }
  
  return (
    <AdminContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ניהול מערכת
      </PageTitle>
      
      <h2>משתמשים רשומים</h2>
      <UserTable>
        <thead>
          <tr>
            <TableHeader>שם</TableHeader>
            <TableHeader>אימייל</TableHeader>
            <TableHeader>תאריך הרשמה</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString('he-IL') : 'לא זמין'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} style={{ textAlign: 'center' }}>אין משתמשים רשומים במערכת</TableCell>
            </TableRow>
          )}
        </tbody>
      </UserTable>
      
      <BookingsSection>
        <h2>שיעורים מוזמנים</h2>
        <UserTable>
          <thead>
            <tr>
              <TableHeader>משתמש</TableHeader>
              <TableHeader>יום</TableHeader>
              <TableHeader>שעה</TableHeader>
              <TableHeader>תאריך הזמנה</TableHeader>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.userName}</TableCell>
                  <TableCell>{booking.day}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>
                    {booking.timestamp ? new Date(booking.timestamp.toDate()).toLocaleDateString('he-IL') : 'לא זמין'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: 'center' }}>אין שיעורים מוזמנים במערכת</TableCell>
              </TableRow>
            )}
          </tbody>
        </UserTable>
      </BookingsSection>
    </AdminContainer>
  );
};

export default Admin;