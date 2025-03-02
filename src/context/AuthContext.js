import React, { createContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // התחברות
  const login = async (email, password) => {
    try {
      // וידוא שהאימייל הוא string
      if (typeof email !== 'string') {
        throw new Error('Email must be a string');
      }
      
      // ניקוי רווחים מיותרים
      const cleanEmail = email.trim();
      
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      console.log('Firebase auth successful:', userCredential.user);
      
      // קבלת מידע נוסף מ-Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        console.log('Firestore user data:', userDoc.exists() ? userDoc.data() : 'No user data');
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const user = {
            uid: userCredential.user.uid,
            email: cleanEmail,
            name: userData.name || userCredential.user.displayName || 'משתמש',
            ...userData
          };
          console.log('Setting current user:', user);
          setCurrentUser(user);
        } else {
          // אם אין מסמך משתמש, צור אחד חדש
          const user = {
            uid: userCredential.user.uid,
            email: cleanEmail,
            name: userCredential.user.displayName || 'משתמש'
          };
          console.log('Creating new user document:', user);
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            ...user,
            createdAt: serverTimestamp()
          });
          setCurrentUser(user);
        }
      } catch (firestoreError) {
        console.error('Error getting user data from Firestore:', firestoreError);
        // אם יש שגיאה בקבלת מידע מ-Firestore, עדיין הגדר את המשתמש עם מידע בסיסי
        setCurrentUser({
          uid: userCredential.user.uid,
          email: cleanEmail,
          name: userCredential.user.displayName || 'משתמש'
        });
      }
      
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // הרשמה
  const register = async (email, password, name) => {
    try {
      // וידוא שהאימייל הוא string
      if (typeof email !== 'string') {
        throw new Error('Email must be a string');
      }
      
      // ניקוי רווחים מיותרים
      const cleanEmail = email.trim();
      
      console.log('Creating user with:', { email: cleanEmail, name });
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      
      // עדכון פרופיל המשתמש עם השם
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // שמירת מידע נוסף על המשתמש ב-Firestore
      const userData = {
        name,
        email: cleanEmail,
        createdAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      // עדכון המשתמש הנוכחי
      setCurrentUser({
        uid: userCredential.user.uid,
        email: cleanEmail,
        name,
        ...userData
      });
      
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // התנתקות
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // מעקב אחר מצב האימות
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            name: userData.name,
            ...userData
          });
        } else {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'משתמש'
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    register,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};