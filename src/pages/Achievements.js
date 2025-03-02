import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTrophy, FaGraduationCap, FaChartLine } from 'react-icons/fa';

const AchievementsContainer = styled.div`
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

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const TestimonialCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  blockquote {
    font-style: italic;
    margin: 0 0 20px 0;
    padding: 0 0 0 20px;
    border-right: 3px solid ${props => props.theme.colors.accent};
    padding-right: 20px;
    line-height: 1.6;
  }
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StudentImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ddd;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StudentDetails = styled.div`
  h4 {
    margin: 0 0 5px 0;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    margin: 0;
    color: ${props => props.theme.colors.gray};
    font-size: 14px;
  }
`;

const StatsSection = styled.div`
  margin-top: 60px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  svg {
    font-size: 40px;
    color: ${props => props.theme.colors.accent};
    margin-bottom: 15px;
  }
  
  h3 {
    font-size: 36px;
    margin: 10px 0;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    color: ${props => props.theme.colors.gray};
    margin: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 30px;
  color: ${props => props.theme.colors.secondary};
  text-align: center;
`;

const Achievements = () => {
  return (
    <AchievementsContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        לוח הישגים
      </PageTitle>
      
      <PageSubtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        הישגי התלמידים שלי הם העדות הטובה ביותר לאיכות ההוראה. כאן תוכלו לראות סיפורי הצלחה, שיפור בציונים וחוויות של תלמידים.
      </PageSubtitle>
      
      <StatsSection>
        <SectionTitle>נתונים מספריים</SectionTitle>
        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FaGraduationCap />
            <h3>150+</h3>
            <p>תלמידים שסיימו בהצלחה</p>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FaChartLine />
            <h3>92%</h3>
            <p>שיפור ממוצע בציונים</p>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FaTrophy />
            <h3>5+</h3>
            <p>שנות ניסיון בהוראה</p>
          </StatCard>
        </StatsGrid>
      </StatsSection>
      
      <StatsSection>
        <SectionTitle>חוויות תלמידים</SectionTitle>
        <TestimonialsGrid>
          <TestimonialCard
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <blockquote>
              "עמית הוא מורה מדהים! הוא הצליח להסביר לי מושגים מורכבים בכימיה אורגנית בצורה פשוטה וברורה. בזכותו הצלחתי לעבור את הקורס בציון 92."
            </blockquote>
            <StudentInfo>
              <StudentImage>
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="תלמידה" />
              </StudentImage>
              <StudentDetails>
                <h4>מיכל לוי</h4>
                <p>סטודנטית לרפואה, אוניברסיטת תל אביב</p>
              </StudentDetails>
            </StudentInfo>
          </TestimonialCard>
          
          <TestimonialCard
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <blockquote>
              "אחרי שנכשלתי פעמיים בקורס כימיה אורגנית, חשבתי שאין לי סיכוי. עמית עזר לי להבין את החומר מהיסוד ולבנות את הידע שלי בצורה מסודרת. עברתי את המבחן בציון 85!"
            </blockquote>
            <StudentInfo>
              <StudentImage>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="תלמיד" />
              </StudentImage>
              <StudentDetails>
                <h4>דניאל כהן</h4>
                <p>סטודנט לביוטכנולוגיה, אוניברסיטת בן גוריון</p>
              </StudentDetails>
            </StudentInfo>
          </TestimonialCard>
          
          <TestimonialCard
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <blockquote>
              "השיעורים עם עמית היו חוויה מעולה. הוא לא רק מלמד את החומר, אלא גם מראה איך הוא מתקשר לעולם האמיתי. הגישה שלו לפתרון בעיות עזרה לי להתמודד עם שאלות מורכבות במבחן."
            </blockquote>
            <StudentInfo>
              <StudentImage>
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="תלמידה" />
              </StudentImage>
              <StudentDetails>
                <h4>נועה ישראלי</h4>
                <p>סטודנטית לכימיה, האוניברסיטה העברית</p>
              </StudentDetails>
            </StudentInfo>
          </TestimonialCard>
        </TestimonialsGrid>
      </StatsSection>
      
      <StatsSection>
        <SectionTitle>שיפור בציונים</SectionTitle>
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '15px' }}>שם התלמיד</th>
                <th style={{ padding: '15px' }}>ציון לפני</th>
                <th style={{ padding: '15px' }}>ציון אחרי</th>
                <th style={{ padding: '15px' }}>שיפור</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>אלון גולן</td>
                <td style={{ padding: '15px' }}>56</td>
                <td style={{ padding: '15px' }}>88</td>
                <td style={{ padding: '15px', color: '#00a854' }}>+32</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>שירה לוי</td>
                <td style={{ padding: '15px' }}>62</td>
                <td style={{ padding: '15px' }}>91</td>
                <td style={{ padding: '15px', color: '#00a854' }}>+29</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>יובל כהן</td>
                <td style={{ padding: '15px' }}>45</td>
                <td style={{ padding: '15px' }}>78</td>
                <td style={{ padding: '15px', color: '#00a854' }}>+33</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>מאיה אברהם</td>
                <td style={{ padding: '15px' }}>70</td>
                <td style={{ padding: '15px' }}>95</td>
                <td style={{ padding: '15px', color: '#00a854' }}>+25</td>
              </tr>
              <tr>
                <td style={{ padding: '15px' }}>עומר שלום</td>
                <td style={{ padding: '15px' }}>58</td>
                <td style={{ padding: '15px' }}>85</td>
                <td style={{ padding: '15px', color: '#00a854' }}>+27</td>
              </tr>
            </tbody>
          </table>
        </div>
      </StatsSection>
    </AchievementsContainer>
  );
};

export default Achievements;