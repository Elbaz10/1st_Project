import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFilePdf, FaFileAlt, FaFlask, FaDownload, FaFilePowerpoint } from 'react-icons/fa';

const MaterialsContainer = styled.div`
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

const MaterialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const MaterialCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  h3 {
    margin-bottom: 15px;
    color: ${props => props.theme.colors.primary};
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  ul {
    padding-right: 20px;
    margin-top: 15px;
  }
  
  li {
    margin-bottom: 10px;
  }
  
  a {
    color: ${props => props.theme.colors.accent};
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const CategoryTitle = styled.h2`
  font-size: 28px;
  margin: 50px 0 20px;
  color: ${props => props.theme.colors.secondary};
  border-bottom: 2px solid ${props => props.theme.colors.light};
  padding-bottom: 10px;
`;

// Add these missing styled components
const CategorySection = styled.div`
  margin-bottom: 40px;
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const MaterialItem = styled.div`
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const MaterialIcon = styled.div`
  font-size: 24px;
  color: ${props => props.theme.colors.accent};
  margin-left: 15px;
`;

const MaterialContent = styled.div`
  flex: 1;
`;

const MaterialTitle = styled.h3`
  margin: 0 0 10px 0;
  color: ${props => props.theme.colors.primary};
  font-size: 18px;
`;

const MaterialDescription = styled.p`
  margin: 0 0 15px 0;
  color: ${props => props.theme.colors.gray};
  font-size: 14px;
  line-height: 1.5;
`;

// הוספת סגנון לכפתור ההורדה
const DownloadButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0077ED;
  }
`;

// יצירת נתונים עם קישורים אמיתיים לקבצים
const materialCategories = [
  {
    id: 1,
    title: 'מצגות שיעור',
    items: [
      {
        id: 1,
        title: 'מבוא לכימיה אורגנית',
        description: 'מצגת מבוא המסבירה את יסודות הכימיה האורגנית, מבנה מולקולות ותכונות בסיסיות.',
        fileType: 'pptx',
        icon: <FaFilePowerpoint />,
        // קישור לקובץ דוגמה - במערכת אמיתית זה יהיה קישור לקובץ בשרת
        fileUrl: '/sample-files/intro-to-organic-chemistry.pptx'
      },
      {
        id: 2,
        title: 'תגובות SN1 ו-SN2',
        description: 'מצגת מפורטת על תגובות החלפה גרעינית, מנגנונים והשוואה בין התגובות.',
        fileType: 'pptx',
        icon: <FaFilePowerpoint />,
        fileUrl: '/sample-files/sn1-sn2-reactions.pptx'
      }
    ]
  },
  {
    id: 2,
    title: 'דפי עבודה',
    items: [
      {
        id: 3,
        title: 'תרגול מנגנוני תגובה',
        description: 'דף עבודה עם תרגילים על מנגנוני תגובה שונים בכימיה אורגנית.',
        fileType: 'pdf',
        icon: <FaFilePdf />,
        fileUrl: '/sample-files/reaction-mechanisms-worksheet.pdf'
      },
      {
        id: 4,
        title: 'תרגול נוסחאות מבנה',
        description: 'תרגילים לציור נוסחאות מבנה של מולקולות אורגניות.',
        fileType: 'pdf',
        icon: <FaFilePdf />,
        fileUrl: '/sample-files/structural-formulas-worksheet.pdf'
      }
    ]
  },
  {
    id: 3,
    title: 'מבחנים לדוגמה',
    items: [
      {
        id: 5,
        title: 'מבחן לדוגמה 1',
        description: 'מבחן לדוגמה הכולל שאלות על כל החומר הנלמד בקורס.',
        fileType: 'pdf',
        icon: <FaFilePdf />,
        fileUrl: '/sample-files/sample-exam-1.pdf'
      },
      {
        id: 6,
        title: 'מבחן לדוגמה 2 עם פתרונות',
        description: 'מבחן לדוגמה נוסף הכולל פתרונות מפורטים לכל השאלות.',
        fileType: 'pdf',
        icon: <FaFilePdf />,
        fileUrl: '/sample-files/sample-exam-2-with-solutions.pdf'
      }
    ]
  }
];

// פונקציה להורדת קבצים
const handleDownload = (fileUrl, fileName) => {
  // יצירת קישור זמני להורדה
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Materials = () => {
  return (
    <MaterialsContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        חומרי לימוד
      </PageTitle>
      
      <PageSubtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        כאן תוכלו למצוא את כל חומרי הלימוד לקורס, כולל מצגות, דפי עבודה, מבחנים לדוגמה ועוד.
      </PageSubtitle>
      
      <MaterialsGrid>
        {materialCategories.map((category) => (
          <CategorySection key={category.id}>
            <CategoryTitle>{category.title}</CategoryTitle>
            <ItemsGrid>
              {category.items.map((item) => (
                <MaterialItem key={item.id}>
                  <MaterialIcon>{item.icon}</MaterialIcon>
                  <MaterialContent>
                    <MaterialTitle>{item.title}</MaterialTitle>
                    <MaterialDescription>{item.description}</MaterialDescription>
                    <DownloadButton 
                      href={item.fileUrl} 
                      download={`${item.title}.${item.fileType}`}
                      onClick={(e) => {
                        // אם הקבצים לא קיימים באמת, יצירת התראה
                        if (!item.fileUrl.startsWith('http')) {
                          e.preventDefault();
                          alert(`הורדת הקובץ "${item.title}" החלה. בסביבת פיתוח, הקבצים לא קיימים באמת.`);
                        }
                      }}
                    >
                      <FaDownload /> הורד קובץ
                    </DownloadButton>
                  </MaterialContent>
                </MaterialItem>
              ))}
            </ItemsGrid>
          </CategorySection>
        ))}
      </MaterialsGrid>
    </MaterialsContainer>
  );
};

export default Materials;