import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 22px;
  z-index: 1000;
  color: ${props => props.theme.colors.light};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  margin: 0 auto;
`;

const NavLink = styled(Link)`
  font-size: 14px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  text-decoration: none;
  color: ${props => props.theme.colors.light};
  
  &:hover {
    opacity: 1;
  }
  
  &.active {
    opacity: 1;
  }
  
  &:visited {
    color: ${props => props.theme.colors.light};
  }
`;

// הוספת סגנון מיוחד לכפתור דף הבית
const HomeNavLink = styled(NavLink)`
  font-weight: 600;
  color: #e6c35a;
  opacity: 1;
  
  &:hover {
    color: #f0d78a;
  }
  
  &:visited {
    color: #e6c35a;
  }
  
  &.active {
    color: #f0d78a;
  }
`;

// Move AdminLink after NavLink is defined
const AdminLink = styled(NavLink)`
  color: #ff9500;
  font-weight: 600;
  
  &:hover {
    color: #ffaa33;
  }
`;

const BookingButton = styled(Link)`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #0077ED;
    transform: scale(1.05);
  }
  
  &:visited {
    color: white;
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.light};
  border: 1px solid ${props => props.theme.colors.light};
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: block;
  }
`;

// הוספת סגנון להסתרת התפריט בגרסת מובייל
const DesktopOnly = styled.div`
  display: flex;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: saturate(180%) blur(20px);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 999;
  text-align: right; /* הוספת יישור לשמאל */
`;

const MobileNavLink = styled(Link)`
  font-size: 18px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  color: ${props => props.theme.colors.light};
  text-align: right; /* הוספת יישור לשמאל */
  
  &:visited {
    color: ${props => props.theme.colors.light};
  }
`;

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  console.log('Navbar currentUser:', currentUser);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // פונקציה לפתיחה/סגירה של תפריט המובייל
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <Nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* שלום משתמש והתנתק - בצד שמאל בדסקטופ */}
        <DesktopOnly style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {currentUser && (
            <>
              <LogoutButton onClick={logout}>התנתק</LogoutButton>
              <UserName>שלום, {currentUser.name}</UserName>
              
            </>
          )}
        </DesktopOnly>
        
        {/* כפתור תפריט למובייל - מוצג רק במובייל */}
        <MobileMenuButton onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
        
        {/* תפריט ניווט - במרכז בדסקטופ */}
        <DesktopOnly>
          <NavLinks className="desktop-nav">
            <NavLink to="/videos" className={location.pathname === '/videos' ? 'active' : ''}>סרטונים</NavLink>
            <NavLink to="/materials" className={location.pathname === '/materials' ? 'active' : ''}>חומרי לימוד</NavLink>
            <NavLink to="/forum" className={location.pathname === '/forum' ? 'active' : ''}>פורום</NavLink>
            <NavLink to="/calculator" className={location.pathname === '/calculator' ? 'active' : ''}>מחשבון מולקולרי</NavLink>
            <NavLink to="/achievements" className={location.pathname === '/achievements' ? 'active' : ''}>לוח הישגים</NavLink>
            <NavLink to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>בלוג</NavLink>
            <HomeNavLink to="/" className={location.pathname === '/' ? 'active' : ''}>דף הבית</HomeNavLink>
          </NavLinks>
        </DesktopOnly>
        
        {/* ניהול וקבע שיעור - בצד ימין */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {currentUser?.email === 'elbazsteam@gmail.com' && (
            <AdminLink 
              to="/admin" 
              className={location.pathname === '/admin' ? 'active' : ''}
              style={{ padding: '8px 0' }}
            >
              ניהול
            </AdminLink>
          )}
          <BookingButton to="/booking">
            קבע שיעור
          </BookingButton>
        </div>
      </Nav>
      
      {/* תפריט מובייל - נשאר ללא שינוי */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MobileNavLink to="/" style={{ color: '#e6c35a', fontWeight: '600', textAlign: 'right' }}>דף הבית</MobileNavLink>
            <MobileNavLink to="/videos" style={{ textAlign: 'right' }}>סרטונים</MobileNavLink>
            <MobileNavLink to="/materials" style={{ textAlign: 'right' }}>חומרי לימוד</MobileNavLink>
            <MobileNavLink to="/forum" style={{ textAlign: 'right' }}>פורום</MobileNavLink>
            <MobileNavLink to="/calculator" style={{ textAlign: 'right' }}>מחשבון מולקולרי</MobileNavLink>
            <MobileNavLink to="/achievements" style={{ textAlign: 'right' }}>לוח הישגים</MobileNavLink>
            <MobileNavLink to="/blog" style={{ textAlign: 'right' }}>בלוג</MobileNavLink>
            
            {currentUser?.email === 'elbazsteam@gmail.com' && (
              <MobileNavLink to="/admin" style={{ color: '#ff9500', textAlign: 'right' }}>ניהול</MobileNavLink>
            )}
            
            {currentUser ? (
              <>
                <UserName style={{ textAlign: 'left' }}>שלום, {currentUser.name}</UserName>
                <LogoutButton onClick={logout} style={{ alignSelf: 'flex-start' }}>התנתק</LogoutButton>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" style={{ textAlign: 'left' }}>התחברות</MobileNavLink>
                <MobileNavLink to="/register" style={{ textAlign: 'left' }}>הרשמה</MobileNavLink>
              </>
            )}
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;