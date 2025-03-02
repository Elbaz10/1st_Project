import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ReactConfetti from 'react-confetti';
import emailjs from '@emailjs/browser';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc } from 'firebase/firestore';
emailjs.init("SchzF6U0xre1ztJTX");
const BookingContainer = styled.div`
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

const PageSubtitle = styled(motion.p)`
  font-size: 18px;
  margin-bottom: 50px;
  text-align: center;
  color: ${props => props.theme.colors.gray};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

// הוספת סגנונות מותאמים למובייל לדף הבוקינג

// עדכון טבלת הבוקינג
const BookingTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 30px;
  padding: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 5px;
    margin-top: 20px;
    overflow-x: auto; /* אפשר גלילה אופקית במובייל */
    width: 100%;
    max-width: 100%;
    display: block;
  }
`;

// עדכון שורת הימים
const DaysRow = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(5, 1fr);
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  text-align: center;
  font-weight: 600;
  border-radius: 8px;
  margin-bottom: 10px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 60px repeat(5, 80px);
    font-size: 12px;
    min-width: 460px; /* מינימום רוחב כדי למנוע חיתוך */
  }
`;

// עדכון שורת הזמנים
const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(5, 1fr);
  margin-bottom: 8px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 60px repeat(5, 80px);
    min-width: 460px; /* מינימום רוחב כדי למנוע חיתוך */
  }
`;

// עדכון תאי היום
const DayCell = styled.div`
  padding: 15px;
  text-align: center;
  font-weight: 500;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 8px 5px;
    font-size: 12px;
  }
`;

// עדכון תאי הזמן
const TimeCell = styled.div`
  padding: 10px;
  text-align: center;
  background-color: ${props => props.theme.colors.light};
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 5px;
    font-size: 12px;
  }
`;

// עדכון תאי ההזמנה
const BookingCell = styled.div`
  padding: 6px;
  text-align: center;
  cursor: ${props => props.isBooked || props.isPast ? 'not-allowed' : 'pointer'};
  background-color: ${props => 
    props.isPast
      ? '#e0e0e0'
      : props.isSelected 
        ? props.theme.colors.accent + '33' 
        : props.isBooked 
          ? '#f0f0f0' 
          : '#d6f4ff'};
  color: ${props => (props.isBooked || props.isPast) ? '#9e9e9e' : 'inherit'};
  transition: all 0.3s ease;
  position: relative;
  margin: 0 2px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  font-size: 12px;
  opacity: ${props => props.isPast ? 0.7 : 1};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    height: 25px;
    font-size: 10px;
    padding: 2px;
    margin: 0 1px;
  }
`;

// עדכון ניווט שבועי
const WeekNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: row;
    gap: 5px;
    margin-bottom: 15px;
    padding: 0 10px;
  }
`;

// עדכון כפתורי ניווט שבועי
const WeekButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.light};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 5px 10px;
    font-size: 12px;
  }
`;

// עדכון תצוגת שבוע
const WeekDisplay = styled.div`
  font-size: 18px;
  font-weight: 500;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 14px;
  }
`;

// מחיקת ההגדרות הכפולות של DayCell ו-TimeRow (שורות 146-158)

const BookedBy = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.accent};
  font-weight: 500;
`;

// הוספת הגדרות חסרות
const MyBookingsSection = styled.div`
  margin-top: 50px;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 20px 15px;
    margin-top: 30px;
  }
`;

const BookingsList = styled.div`
  display: grid;
  gap: 15px;
  margin-top: 20px;
`;

const BookingItem = styled.div`
  padding: 20px;
  background: ${props => props.isPast ? '#f5f5f5' : props.theme.colors.light};
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-right: 4px solid ${props => props.isPast ? '#9e9e9e' : props.theme.colors.accent};
  opacity: ${props => props.isPast ? 0.8 : 1};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 50px;
  padding: 30px;
  background-color: ${props => props.theme.colors.light};
  border-radius: 12px;
`;

const LoginLink = styled(Link)`
  color: ${props => props.theme.colors.accent};
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Add these styled components for success and error messages
const SuccessMessage = styled.div`
  background-color: #4caf50;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin: 20px auto;
  text-align: center;
  max-width: 600px;
`;

const ErrorMessage = styled.div`
  background-color: #f44336;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin: 20px auto;
  text-align: center;
  max-width: 600px;
`;

const BookingButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: 15px 30px;
  border-radius: 980px;
  border: none;
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 40px auto 0;
  
  &:hover {
    background-color: #0077ED;
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.gray};
    cursor: not-allowed;
  }
`;

const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'];
const timeSlots = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const ResetButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 8px 15px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const Booking = () => {
  const { currentUser } = useContext(AuthContext);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookings, setBookings] = useState({});
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState(''); // הוספת משתנה error
  const [success, setSuccess] = useState(''); // הוספת משתנה success
  const navigate = useNavigate(); // הוספת navigate
  
  // Add handleBookingSubmit function
  // Fix the handleBookingSubmit function to correctly extract day and time
  // עדכון פונקציית handleBookingSubmit - הצגת קונפטי מיד בתחילת התהליך
  const handleBookingSubmit = async () => {
    if (!selectedSlot) return;
    
    // הצגת קונפטי מיד בתחילת התהליך
    setShowConfetti(true);
    
    // Extract day and time from the selected slot
    const parts = selectedSlot.split('-');
    const day = parts[0];
    const time = parts[1];
    
    console.log('Booking slot:', { day, time, selectedSlot });
    
    try {
      await handleBooking(day, time);
      
      // הקונפטי יישאר למשך 7 שניות (מוגדר כאן במקום בתוך handleBooking)
      setTimeout(() => setShowConfetti(false), 7000);
      
      // Reset selected slot
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error submitting booking:', error);
      // ביטול הקונפטי במקרה של שגיאה
      setShowConfetti(false);
    }
  };
  
  // Add reset function
  // עדכון פונקציית resetAllBookings כדי למחוביד גם מה-database
  // עדכון פונקציית resetAllBookings כדי לתמוך בהרשאות Admin
  const resetAllBookings = async () => {
    // בדיקה אם המשתמש הוא Admin
    const isAdmin = currentUser && currentUser.email === 'elbazsteam@gmail.com';
    
    // הודעת אישור מותאמת לסוג המשתמש
    const confirmMessage = isAdmin 
      ? 'האם אתה בטוח שברצונך לאפס את כל השיעורים של כל המשתמשים? פעולה זו אינה ניתנת לביטול.'
      : 'האם אתה בטוח שברצונך לאפס את כל השיעורים שלך? פעולה זו אינה ניתנת לביטול.';
    
    if (window.confirm(confirmMessage)) {
      try {
        // מחיקת הזמנות מה-Firestore
        if (currentUser) {
          const bookingsRef = collection(db, 'bookings');
          
          // שאילתה שונה בהתאמה לסוג המשתמש
          const q = isAdmin 
            ? query(bookingsRef) // Admin - מחיקת כל הזמנות
            : query(bookingsRef, where('userId', '==', currentUser.uid)); // משתמש רגיל - רק הזמנות שלו
          
          const querySnapshot = await getDocs(q);
          
          // מחיקת הזמנות
          const deletePromises = querySnapshot.docs.map(doc => {
            return deleteDoc(doc.ref);
          });
          
          await Promise.all(deletePromises);
          
          // הודעת הצלחה
          setSuccess(isAdmin 
            ? 'כל השיעורים של כל המשתמשים אופסו בהצלחה' 
            : 'כל השיעורים שלך אופסו בהצלחה');
        }
        
        // עדכון ה-localStorage והמצב המקומי
        if (isAdmin) {
          // Admin - איפוס כל ההזמנות
          localStorage.removeItem('bookings');
          setBookings({});
        } else {
          // משתמש רגיל - איפוס רק ההזמנות שלו
          const updatedBookings = {};
          
          // שמירת ההזמנות שאינן של המשתמש הנוכחי
          Object.entries(bookings).forEach(([key, booking]) => {
            if (booking.user !== currentUser.name) {
              updatedBookings[key] = booking;
            }
          });
          
          localStorage.setItem('bookings', JSON.stringify(updatedBookings));
          setBookings(updatedBookings);
        }
        
        setSelectedSlot(null);
        setError('');
      } catch (error) {
        console.error('Error resetting bookings:', error);
        setError('אירעה שגיאה באיפוס השיעורים');
      }
    }
  };

  // פונקציה לקבלת תאריך היום הראשון של השבוע הנוכחי + מספר שבועות
  // עדכון הפונקציה כדי להתאים ללוח השנה הישראלי (שבוע מתחילביום ראשון)
  const getWeekStartDate = (weekOffset = 0) => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // יום ראשון = 0, שבת = 6
    const startOfWeek = new Date(now);
    
    // אם היום הוא יום ראשון (0), אז זה כבר תחילת השבוע
    // אחרת, נחזור אחורה למספר הימים המתאים כדי להגיע ליום ראשון
    startOfWeek.setDate(now.getDate() - dayOfWeek + (weekOffset * 7));
    
    return startOfWeek;
  };
  
  // פונקציה לפורמט תאריך
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  // חישוב תאריכי השבוע הנוכחי
  const weekStart = getWeekStartDate(currentWeek);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4); // עד יום חמישי
  
  // Load bookings from localStorage
  useEffect(() => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    
    // עדכון התאריך הנוכחי בעת טעינת הדף
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    
    // אם היום הוא שבת, נציג את השבוע הבא
    if (currentDayOfWeek === 6) {
      setCurrentWeek(1);
    } else {
      setCurrentWeek(0);
    }
    
    // עדכון אוטומטי של התצוגה כל דקה
    const intervalId = setInterval(() => {
      // אילו� רינדור מחדש
      setBookings(prev => ({...prev}));
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Update the slot key to include the week information
  const getSlotKey = (day, time, weekOffset) => {
    return `${day}-${time}-week${weekOffset}`;
  };
  
  // Add these missing functions
  const isSlotBooked = (day, time) => {
    const slotKey = getSlotKey(day, time, currentWeek);
    return bookings[slotKey] !== undefined;
  };
  
  const getBookedBy = (day, time) => {
    const slotKey = getSlotKey(day, time, currentWeek);
    return bookings[slotKey]?.user || '';
  };
  
  // פונקציה לבדיקה האם תאריך מסוים כבר עבר
  const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  // פונקציה לבדיקה האם שעה מסוימת כבר עברה ביומן הנוכחי
  const isTimeInPast = (time, date) => {
    const today = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    // אם התאריך הוא היום, בדוק גם את השעה
    if (date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear()) {
      return (today.getHours() > hours || 
             (today.getHours() === hours && today.getMinutes() > minutes));
    }
    
    return false;
  };
  
  // בדיקה האם משבצת זמן כבר עברה
  const isSlotInPast = (day, time) => {
    const dayIndex = days.indexOf(day);
    const slotDate = new Date(weekStart);
    slotDate.setDate(slotDate.getDate() + dayIndex);
    
    return isDateInPast(slotDate) || isTimeInPast(time, slotDate);
  };
  
  // Add the missing handleSlotClick function
  const handleSlotClick = (day, time) => {
    if (!currentUser) return;
    
    const slotKey = getSlotKey(day, time, currentWeek);
    if (bookings[slotKey]) return;
    
    // בדיקה שהמשבצת לא בעבר
    if (isSlotInPast(day, time)) return;
    
    setSelectedSlot(slotKey);
  };
  
  // תיקון פונקציית sendBookingEmail כדי לשלוח למייל של המשתמש
  // עדכון פונקציית sendBookingEmail עם פרמטרים מתאימים לתבנית
  const sendBookingEmail = async (day, time) => {
    if (!currentUser || !currentUser.email) {
      console.error('No user email available');
      return;
    }
    
    try {
      console.log('Sending email to:', currentUser.email);
      
      // שינוי שמות הפרמטרים לפי התבנית של EmailJS
      const templateParams = {
        to_name: currentUser.name || 'תלמיד',
        to_email: currentUser.email,
        from_name: 'מערכת הזמנת שיעורים',
        message: `הזמנת שיעור ליום ${day} בשעה ${time}`,
        day: day,
        time: time,
        date: new Date().toLocaleDateString('he-IL')
      };
      
      console.log('Email template parameters:', templateParams);
      
      // שליחת המייל עם פרמטרים מעודכנים
      const result = await emailjs.send(
        'service_v7mp8mp',  // Service ID
        'template_3r2sf9e', // Template ID
        templateParams,
        'SchzF6U0xre1ztJTX' // Public Key
      );
      
      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      console.error('Error details:', error.text || error.message);
      // לא לזרוק שגיאה כדי שהתהליך ימשיך גם אם שליחת המייל נכשלה
      return null;
    }
  };

  // עדכון פונקציית handleBooking - הסרת הצגת הקונפטי מכאן
  const handleBooking = async (day, time) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      // בדיקה אם השיעור כבר הוזמן
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('day', '==', day), where('time', '==', time), where('weekOffset', '==', currentWeek));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // במקום להציג הודעת שגיאה, פשוט נחזור מהפונקציה
        return;
      }

      // הוספת ההזמנה ל-Firestore
      await addDoc(bookingsRef, {
        userId: currentUser.uid,
        userName: currentUser.name,
        userEmail: currentUser.email,
        day,
        time,
        weekOffset: currentWeek,
        timestamp: serverTimestamp()
      });
      
      // עדכון המצב המקומי
      const slotKey = getSlotKey(day, time, currentWeek);
      setBookings(prev => ({
        ...prev,
        [slotKey]: {
          user: currentUser.name,
          timestamp: new Date().toISOString()
        }
      }));
      
      // שמירה ב-localStorage
      const updatedBookings = {
        ...bookings,
        [slotKey]: {
          user: currentUser.name,
          timestamp: new Date().toISOString()
        }
      };
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      
      // שליחת אימייל אישור - קריאה מחדש עם פרמטרים נכונים
      await sendBookingEmail(day, time);
      
    } catch (error) {
      console.error('Error booking lesson:', error);
      throw error; // זריקת השגיאה כדי שתיתפס ב-handleBookingSubmit
    }
  };

  // Update the getMyBookings function to include date information
  // Update the getMyBookings function to fix the past/future classification
  const getMyBookings = () => {
    const now = new Date();
    return Object.entries(bookings)
      .filter(([_, booking]) => booking.user === currentUser?.name)
      .map(([slot, booking]) => {
        const parts = slot.split('-');
        const day = parts[0];
        const time = parts[1];
        // Add a check for weekStr to handle cases where it might be undefined
        const weekStr = parts[2] || 'week0';
        const weekOffset = parseInt(weekStr.replace('week', '')) || 0;
        
        const bookingDate = getWeekStartDate(weekOffset);
        const dayIndex = days.indexOf(day);
        bookingDate.setDate(bookingDate.getDate() + dayIndex);
        
        // הוספת שעות לתאריך כדי להשוואן
        const [hours, minutes] = time.split(':').map(Number);
        bookingDate.setHours(hours, minutes, 0, 0);
        
        return {
          day,
          time,
          date: bookingDate,
          timestamp: new Date(booking.timestamp),
          isPast: bookingDate < now // כעת ההשוואה תהיה מדויקת יותר
        };
      })
      .sort((a, b) => a.date - b.date);
  };

  return (
    <BookingContainer>
      {showConfetti && <ReactConfetti />}
      
      {currentUser ? (
        <>
          <PageTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            קביעת שיעור
          </PageTitle>
          
          <PageSubtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            בחר את הזמן המתאים לך לשיעור פרטי. השיעורים מתקיימים בימים ראשון עד חמישי, בין השעות 9:00 ל-17:00.
          </PageSubtitle>
          
          {success && <SuccessMessage>{success}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
      
          <WeekNavigation>
            <WeekButton 
              onClick={() => setCurrentWeek(currentWeek - 1)}
              disabled={currentWeek <= 0}
            >
              &lt; שבוע קודם
            </WeekButton>
            
            <WeekDisplay>
              {formatDate(weekStart)} - {formatDate(weekEnd)}
            </WeekDisplay>
            
            <WeekButton 
              onClick={() => setCurrentWeek(currentWeek + 1)}
            >
              שבוע הבא &gt;
            </WeekButton>
          </WeekNavigation>
          
          <BookingTable
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <DaysRow>
              <DayCell>שעה / יום</DayCell>
              {days.map(day => (
                <DayCell key={day}>{day}</DayCell>
              ))}
            </DaysRow>
            
            {timeSlots.map(time => (
              <TimeRow key={time}>
                <TimeCell>{time}</TimeCell>
                {days.map(day => {
                  const booked = isSlotBooked(day, time);
                  const selected = selectedSlot === getSlotKey(day, time, currentWeek);
                  const bookedBy = getBookedBy(day, time);
                  const isPast = isSlotInPast(day, time);
                  
                  return (
                    <BookingCell
                      key={day}
                      isBooked={booked}
                      isSelected={selected}
                      isPast={isPast}
                      onClick={() => !booked && !isPast && handleSlotClick(day, time)}
                    >
                      {booked ? (
                        <BookedBy>{bookedBy}</BookedBy>
                      ) : selected ? (
                        'נבחר'
                      ) : (
                        ''  /* הסרת הטקסט "עבר" */
                      )}
                    </BookingCell>
                  );
                })}
              </TimeRow>
            ))}
          </BookingTable>
      
          <BookingButton
            onClick={handleBookingSubmit}
            disabled={!selectedSlot}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            קבע שיעור
          </BookingButton>
      
          <MyBookingsSection
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2>השיעורים שלי</h2>
            <BookingsList>
              {getMyBookings().length > 0 ? (
                <>
                  <h3>שיעורים עתידיים</h3>
                  {getMyBookings()
                    .filter(booking => !booking.isPast)
                    .map((booking, index) => (
                      <BookingItem key={index}>
                        <span>יום {booking.day} בשעה {booking.time}</span>
                        <span>תאריך: {booking.date.toLocaleDateString('he-IL')}</span>
                      </BookingItem>
                    ))}
                  
                  <h3 style={{ marginTop: '30px' }}>שיעורים קודמים</h3>
                  {getMyBookings()
                    .filter(booking => booking.isPast)
                    .map((booking, index) => (
                      <BookingItem key={index} isPast>
                        <span>יום {booking.day} בשעה {booking.time}</span>
                        <span>תאריך: {booking.date.toLocaleDateString('he-IL')}</span>
                      </BookingItem>
                    ))}
                </>
              ) : (
                <p>אין לך שיעורים מתוכננים כרגע.</p>
              )}
            </BookingsList>
            
            {/* Add reset button */}
            <div style={{ textAlign: 'center' }}>
              <ResetButton onClick={resetAllBookings}>
                אפס את כל השיעורים
              </ResetButton>
            </div>
          </MyBookingsSection>
        </>
      ) : (
        <LoginPrompt>
          <h3>עליך להתחבר כדי לקבוע שיעור</h3>
          <p>אנא <LoginLink to="/login">התחבר</LoginLink> או <LoginLink to="/register">הירשם</LoginLink> כדי לקבע שיעור.</p>
        </LoginPrompt>
      )}
    </BookingContainer>
  );
};

export default Booking;