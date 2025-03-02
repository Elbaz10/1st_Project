import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const VideosContainer = styled.div`
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

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const VideoCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

const VideoThumbnail = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background-color: #f0f0f0;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const VideoInfo = styled.div`
  padding: 20px;
`;

const VideoTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.primary};
`;

const VideoDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 15px;
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 12px;
`;

const CategoryTab = styled.button`
  padding: 12px 24px;
  background-color: ${props => props.isActive ? props.theme.colors.accent : 'white'};
  color: ${props => props.isActive ? 'white' : props.theme.colors.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 15px;
  box-shadow: ${props => props.isActive 
    ? '0 8px 16px rgba(0, 120, 212, 0.2)' 
    : '0 4px 8px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-2px);
    background-color: ${props => props.isActive ? props.theme.colors.accent : '#f8f9fa'};
    box-shadow: ${props => props.isActive 
      ? '0 10px 20px rgba(0, 120, 212, 0.25)' 
      : '0 6px 12px rgba(0, 0, 0, 0.1)'};
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const Videos = () => {
  const [activeCategory, setActiveCategory] = useState('הכל');
  
  const categories = ['הכל', 'ביולוגיה', 'כימיה', 'פיזיקה', 'מתמטיקה'];
  
  const videoData = [
    {
      id: 1,
      title: 'מבוא לביולוגיה תאית',
      description: 'הסבר מקיף על מבנה ותפקוד התא',
      category: 'ביולוגיה',
      embedId: 'URUJD5NEXC8', // Amoeba Sisters: Introduction to Cells
    },
    {
      id: 2,
      title: 'פוטוסינתזה',
      description: 'תהליך הפוטוסינתזה והמשמעות שלו',
      category: 'ביולוגיה',
      embedId: 'uixA8ZXx0KU', // Amoeba Sisters: Photosynthesis
    },
    {
      id: 3,
      title: 'מבנה האטום',
      description: 'הסבר על מבנה האטום והחלקיקים המרכיבים אותו',
      category: 'כימיה',
      embedId: 'rz4Dd1I_fX0', // Crash Course: The Atom
    },
    {
      id: 4,
      title: 'טבלה מחזורית',
      description: 'הסבר על הטבלה המחזורית ומשמעותה',
      category: 'כימיה',
      embedId: 'LDHg7Vgzses', // Crash Course: The Periodic Table
    },
    {
      id: 5,
      title: 'חוקי ניוטון',
      description: 'הסבר על שלושת חוקי התנועה של ניוטון',
      category: 'פיזיקה',
      embedId: 'kKKM8Y-u7ds', // Crash Course: Newton's Laws
    },
    {
      id: 6,
      title: 'אנרגיה וצורותיה',
      description: 'הסבר על סוגי אנרגיה והמרות אנרגיה',
      category: 'פיזיקה',
      embedId: 'CW0_S5YpYVo', // Crash Course: Work, Energy, and Power
    },
    {
      id: 7,
      title: 'פונקציות וגרפים',
      description: 'הסבר על פונקציות מתמטיות וייצוגן הגרפי',
      category: 'מתמטיקה',
      embedId: 'NybHckSEQBI', // Khan Academy: Introduction to Functions
    },
    {
      id: 8,
      title: 'חשבון דיפרנציאלי',
      description: 'מבוא לחשבון דיפרנציאלי ונגזרות',
      category: 'מתמטיקה',
      embedId: 'EKvHQc3QEow', // Crash Course: Derivatives
    },
    {
      id: 9,
      title: 'מערכת העיכול',
      description: 'הסבר על מערכת העיכול ותפקודה',
      category: 'ביולוגיה',
      embedId: 'Og5xAdC8EUI', // Crash Course: Digestive System
    },
    {
      id: 10,
      title: 'תורשה ומנדל',
      description: 'הסבר על חוקי מנדל והתורשה',
      category: 'ביולוגיה',
      embedId: 'CBezq1fFUEA', // Amoeba Sisters: Heredity
    },
    {
      id: 11,
      title: 'תגובות כימיות',
      description: 'הסבר על סוגי תגובות כימיות',
      category: 'כימיה',
      embedId: 'eNsVaUCzvLA', // Crash Course: Chemical Reactions
    },
    {
      id: 12,
      title: 'גלים וקול',
      description: 'הסבר על תכונות הגלים והקול',
      category: 'פיזיקה',
      embedId: 'qV4lR9EWGlY', // Crash Course: Sound
    }
  ];
  
  const filteredVideos = activeCategory === 'הכל' 
    ? videoData 
    : videoData.filter(video => video.category === activeCategory);
  
  return (
    <VideosContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        סרטוני לימוד
      </PageTitle>
      
      <PageSubtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        צפה בסרטוני לימוד מקיפים במגוון נושאים. הסרטונים מסודרים לפי קטגוריות לנוחיותך.
      </PageSubtitle>
      
      <CategoryTabs>
        {categories.map(category => (
          <CategoryTab 
            key={category}
            isActive={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </CategoryTab>
        ))}
      </CategoryTabs>
      
      <VideoGrid>
        {filteredVideos.map(video => (
          <VideoCard 
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VideoThumbnail>
              <iframe
                src={`https://www.youtube.com/embed/${video.embedId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoThumbnail>
            <VideoInfo>
              <VideoTitle>{video.title}</VideoTitle>
              <VideoDescription>{video.description}</VideoDescription>
            </VideoInfo>
          </VideoCard>
        ))}
      </VideoGrid>
    </VideosContainer>
  );
};

export default Videos;