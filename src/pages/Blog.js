import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaArrowRight, FaTimes } from 'react-icons/fa';

const BlogContainer = styled.div`
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

const BlogPostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
`;

const BlogPost = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const BlogImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  ${BlogPost}:hover & img {
    transform: scale(1.05);
  }
`;

const BlogContent = styled.div`
  padding: 25px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    color: ${props => props.theme.colors.gray};
    margin-bottom: 15px;
  }
`;

const BlogDate = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.accent};
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const BlogAuthor = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ReadMoreButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.accent};
  padding: 0;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Add these new styled components for the article modal
const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  direction: rtl;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  left: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.theme.colors.gray};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ArticleHeader = styled.div`
  margin-bottom: 30px;
`;

const ArticleTitle = styled.h1`
  font-size: 32px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 15px;
`;

const ArticleMeta = styled.div`
  display: flex;
  gap: 20px;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 20px;
`;

const ArticleImage = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ArticleContent = styled.div`
  line-height: 1.8;
  
  p {
    margin-bottom: 20px;
  }
  
  h2 {
    margin-top: 30px;
    margin-bottom: 15px;
    color: ${props => props.theme.colors.primary};
  }
  
  ul, ol {
    margin-bottom: 20px;
    padding-right: 20px;
  }
  
  li {
    margin-bottom: 10px;
  }
`;

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: '5 טיפים להצלחה בכימיה אורגנית',
    excerpt: 'כימיה אורגנית נחשבת לאחד הקורסים המאתגרים ביותר בתואר. במאמר זה אשתף 5 טיפים שיעזרו לכם להצליחה בקורס...',
    content: `
      <p>כימיה אורגנית נחשבת לאחד הקורסים המאתגרים ביותר בתואר. רבים מהסטודנטים מתקשים להבין את החומר ולהצליח במבחנים. אחרי שנים של הוראת הנושא, אני רוצה לשתף אתכם ב-5 טיפים שיעזרו לכם להצליח בקורס.</p>
      
      <h2>1. הבנה במקום שינון</h2>
      <p>אחת הטעויות הנפוצות ביותר היא ניסיון לשנן את כל התגובות והמנגנונים. כימיה אורגנית מבוססת על עקרונות והגיון, ולא על זיכרון בלבד. במקום לשנן, נסו להבין את העקרונות הבסיסיים: אלקטרופיליות, נוקלאופיליות, יציבות, סטריאוכימיה וכו'. כשתבינו את העקרונות, תוכלו לנבא תגובות גם אם לא נתקלתם בהן קודם.</p>
      
      <h2>2. תרגול, תרגול ועוד תרגול</h2>
      <p>אין תחליף לתרגול בכימיה אורגנית. פתרו כמה שיותר תרגילים, ציירו מנגנונים, נסו לפתור בעיות חדשות. ככל שתתרגלו יותר, כך תפתחו אינטואיציה טובה יותר לגבי התנהגות של מולקולות אורגניות.</p>
      
      <h2>3. ציירו מנגנונים</h2>
      <p>אל תסתפקו בידיעה איזה תוצר מתקבל בתגובה. הבינו את המנגנון המלא: מאיפה מגיעים האלקטרונים, איך נוצרים ונשברים קשרים, מהם תוצרי הביניים. ציור מנגנונים מלאים יעזור לכם להבין לעומק את התהליכים הכימיים.</p>
      
      <h2>4. למדו בקבוצות</h2>
      <p>לימוד בקבוצה יכול להיות יעיל מאוד בכימיה אורגנית. הסבר של מושגים לאחרים מחזק את ההבנה שלכם, ולעתים חבר לקבוצה יכול להציע זווית ראייה שלא חשבתם עליה.</p>
      
      <h2>5. השתמשו במודלים מולקולריים</h2>
      <p>כימיה אורגנית היא תלת-ממדית, וקשה לדמיין את המבנה המרחבי של מולקולות מורכבות. השתמשו במודלים פיזיים או בתוכנות מחשב כדי לראות את המולקולות במרחב. זה יעזור לכם להבין טוב יותר נושאים כמו סטריאוכימיה, קונפורמציות וכו'.</p>
    `,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69',
    date: '12 באוקטובר, 2023',
    author: 'עמית אלבז'
  },
  {
    id: 2,
    title: 'הבנת תגובות SN1 ו-SN2: המדריך המלא',
    excerpt: 'תגובות החלפה גרעינית הן מהנושאים החשובים ביותר בכימיה אורגנית. במאמר זה נסביר את ההבדלים בין SN1 ו-SN2...',
    content: `
      <p>תגובות החלפה גרעינית (Nucleophilic Substitution) הן מהנושאים החשובים ביותר בכימיה אורגנית. הבנה טובה של תגובות אלו חיונית להצלחה בקורס. במאמר זה נסביר את ההבדלים בין תגובות SN1 ו-SN2, ואיך לזהות איזו תגובה תתרחש במקרה נתון.</p>
      
      <h2>תגובת SN2: החלפה גרעינית בימולקולרית</h2>
      <p>תגובת SN2 מתרחשת בשלב אחד, כאשר הנוקלאופיל תוקף את הפחמן מהכיוון ההפוך לקבוצה העוזבת. התגובה מלווה בהיפוך מרחבי (inversion of configuration).</p>
      
      <p>מאפיינים של תגובת SN2:</p>
      <ul>
        <li>מהירות התגובה תלויה בריכוז הנוקלאופיל והסובסטרט (קינטיקה מסדר שני)</li>
        <li>מועדפת עבור סובסטרטים ראשוניים ושניוניים</li>
        <li>מועדפת בממסים אפרוטיים פולריים</li>
        <li>נוקלאופילים חזקים מעודדים תגובת SN2</li>
        <li>סטריאוכימיה: היפוך מרחבי</li>
      </ul>
      
      <h2>תגובת SN1: החלפה גרעינית מונומולקולרית</h2>
      <p>תגובת SN1 מתרחשת בשני שלבים: תחילה הקבוצה העוזבת עוזבת ויוצרת קרבוקטיון, ואז הנוקלאופיל תוקף את הקרבוקטיון.</p>
      
      <p>מאפיינים של תגובת SN1:</p>
      <ul>
        <li>מהירות התגובה תלויה רק בריכוז הסובסטרט (קינטיקה מסדר ראשון)</li>
        <li>מועדפת עבור סובסטרטים שלישוניים</li>
        <li>מועדפת בממסים פרוטיים פולריים</li>
        <li>יציבות הקרבוקטיון היא גורם מכריע</li>
        <li>סטריאוכימיה: רצמיזציה (תערובת רצמית)</li>
      </ul>
      
      <h2>איך לזהות איזו תגובה תתרחש?</h2>
      <p>כדי לקבוע איזו תגובה תתרחש במקרה נתון, יש לבחון מספר גורמים:</p>
      <ol>
        <li>מבנה הסובסטרט: ראשוני, שניוני או שלישוני</li>
        <li>חוזק הנוקלאופיל</li>
        <li>סוג הממס</li>
        <li>טמפרטורה</li>
        <li>ריכוז הנוקלאופיל</li>
      </ol>
      
      <p>לדוגמה, אם יש לנו הליד אלקיל שלישוני בממס פרוטי פולרי, סביר להניח שתתרחש תגובת SN1. לעומק זאת, אם יש לנו הליד אלקיל ראשוני ונוקלאופיל חזק בממס אפרוטי, סביר שתתרחש תגובת SN2.</p>
    `,
    image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6',
    date: '5 באוקטובר, 2023',
    author: 'עמית אלבז'
  }
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  
  const openArticle = (post) => {
    setSelectedPost(post);
  };
  
  const closeArticle = () => {
    setSelectedPost(null);
  };
  
  return (
    <BlogContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        בלוג כימיה
      </PageTitle>
      
      <PageSubtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        מאמרים, טיפים והסברים בנושאי כימיה אורגנית
      </PageSubtitle>
      
      <BlogPostsGrid>
        {blogPosts.map((post) => (
          <BlogPost
            key={post.id}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: post.id * 0.1 }}
            onClick={() => openArticle(post)}
          >
            <BlogImage>
              <img src={post.image} alt={post.title} />
            </BlogImage>
            <BlogContent>
              <BlogDate>
                <FaCalendarAlt /> {post.date}
              </BlogDate>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <ReadMoreButton>
                קרא עוד <FaArrowRight style={{ marginRight: '5px' }} />
              </ReadMoreButton>
            </BlogContent>
          </BlogPost>
        ))}
      </BlogPostsGrid>
      
      <AnimatePresence>
        {selectedPost && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <CloseButton onClick={closeArticle}>
                <FaTimes />
              </CloseButton>
              
              <ArticleHeader>
                <ArticleTitle>{selectedPost.title}</ArticleTitle>
                <ArticleMeta>
                  <span><FaCalendarAlt /> {selectedPost.date}</span>
                  <span><FaUser /> {selectedPost.author}</span>
                </ArticleMeta>
              </ArticleHeader>
              
              <ArticleImage>
                <img src={selectedPost.image} alt={selectedPost.title} />
              </ArticleImage>
              
              <ArticleContent dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </BlogContainer>
  );
};

export default Blog;