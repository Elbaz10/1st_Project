import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import Molecules from '../components/Molecules';

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(50, 50, 50, 0.3) 0%, rgba(0, 0, 0, 0.8) 80%);
  z-index: 1;
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  max-width: 800px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 56px;
  margin-bottom: 20px;
  background: linear-gradient(to right, #fff, #ccc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 40px;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 24px;
  margin-bottom: 40px;
  color: #aaa;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const HeroButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: 15px 30px;
  border-radius: 980px;
  border: none;
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #0077ED;
    transform: scale(1.05);
  }
`;

const Section = styled.section`
  padding: 100px 0;
  background-color: ${props => props.theme.colors.white};
  overflow: hidden;
  
  &:nth-child(even) {
    background-color: ${props => props.theme.colors.light};
  }
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: ${props => props.reverse ? 'row-reverse' : 'row'};
  align-items: center;
  gap: 60px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 40px;
  }
`;

const SectionText = styled(motion.div)`
  flex: 1;
  direction: rtl;
`;

const SectionImage = styled(motion.div)`
  flex: 1;
  img {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 40px;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.primary};
`;

const SectionDescription = styled(motion.p)`
  font-size: 18px;
  line-height: 1.6;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 30px;
`;

const Home = () => {
  // Animation controls
  const controls = useAnimation();
  
  // Hero animations
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  // Section animations
  const sectionVariants = {
    offscreen: {
      y: 100,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };
  
  return (
    <div className="rtl">
      <HeroSection>
        <Molecules />
        <HeroBackground />
        <HeroContent
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <HeroTitle variants={itemVariants}>
            עמית אלבז
          </HeroTitle>
          <HeroTitle variants={itemVariants}>
             מורה פרטי לכימיה אורגנית
          </HeroTitle>
          <HeroSubtitle variants={itemVariants}>
            בוגר תואר ראשון בביולוגיה מאוניברסיטת בן גוריון
          </HeroSubtitle>
          <HeroButton 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            as={Link}
            to="/booking"
          >
            קבע שיעור עכשיו
          </HeroButton>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionContent>
          <SectionText
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <SectionTitle>מי אני?</SectionTitle>
            <SectionDescription>
              שמי עמית אלבז, בוגר תואר ראשון בביולוגיה מאוניברסיטת בן גוריון. אני מתמחה בהוראת כימיה אורגנית ומלווה סטודנטים להצלחה כבר למעלה מ-5 שנים. הגישה שלי משלבת הסברים ברורים, תרגול מעשי והתאמה אישית לצרכי התלמיד.
            </SectionDescription>
          </SectionText>
          <SectionImage
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" alt="מורה לכימיה" />
          </SectionImage>
        </SectionContent>
      </Section>

      <Section>
        <SectionContent reverse>
          <SectionText
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <SectionTitle>השירותים שלי</SectionTitle>
            <SectionDescription>
              אני מציע שיעורים פרטיים בכימיה אורגנית לסטודנטים בכל הרמות. השיעורים מותאמים אישית לצרכים שלך ויכולים לכלול:
              <br /><br />
              • הסבר מעמיק של חומר הלימוד<br />
              • פתרון תרגילים ומבחנים<br />
              • הכנה למבחנים<br />
              • עזרה בפרויקטים ועבודות<br />
              • חומרי לימוד מותאמים אישית
            </SectionDescription>
          </SectionText>
          <SectionImage
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" alt="שיעורים פרטיים" />
          </SectionImage>
        </SectionContent>
      </Section>

      <Section>
        <SectionContent>
          <SectionText
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <SectionTitle>למה לבחור בי?</SectionTitle>
            <SectionDescription>
              • ניסיון רב בהוראת כימיה אורגנית<br />
              • רקע אקדמי מוצק מאוניברסיטת בן גוריון<br />
              • גישה מותאמת אישית לכל תלמיד<br />
              • זמינות גבוהה לשאלות גם מחוץ לשעות השיעור<br />
              • חומרי לימוד מקיפים ועדכניים<br />
              • אחוזי הצלחה גבוהים של תלמידים
            </SectionDescription>
          </SectionText>
          <SectionImage
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" alt="הצלחה בלימודים" />
          </SectionImage>
        </SectionContent>
      </Section>

      {/* Add a centered button container */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '50px 0 80px',
        width: '100%' 
      }}>
        <HeroButton 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          as={Link}
          to="/booking"
        >
          קבע שיעור עכשיו
        </HeroButton>
      </div>
    </div>
  );
};

export default Home;