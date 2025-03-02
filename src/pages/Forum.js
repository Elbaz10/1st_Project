import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaUser, FaClock, FaReply, FaThumbsUp } from 'react-icons/fa';

const ForumContainer = styled.div`
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

const ForumActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const NewQuestionButton = styled.button`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #0077ED;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  
  input {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 300px;
    font-size: 16px;
  }
  
  button {
    background-color: ${props => props.theme.colors.secondary};
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 0 8px 8px 0;
    margin-right: -1px;
    cursor: pointer;
  }
`;

const QuestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QuestionCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const QuestionTitle = styled.h3`
  font-size: 20px;
  color: ${props => props.theme.colors.primary};
  margin: 0;
`;

const QuestionStats = styled.div`
  display: flex;
  gap: 15px;
  color: ${props => props.theme.colors.gray};
  font-size: 14px;
`;

const QuestionMeta = styled.div`
  display: flex;
  gap: 15px;
  color: ${props => props.theme.colors.gray};
  font-size: 14px;
  margin-bottom: 15px;
`;

const QuestionContent = styled.p`
  margin-bottom: 20px;
  line-height: 1.6;
`;

const QuestionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.accent};
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Sample questions data
const sampleQuestions = [
  {
    id: 1,
    title: 'איך מזהים תגובת SN1 לעומת SN2?',
    content: 'אני מתקשה להבין את ההבדלים בין תגובות SN1 ו-SN2. האם מישהו יכול להסביר את הסימנים המזהים של כל אחת מהתגובות ואיך לדעת איזו תגובה תתרחש במקרה נתון?',
    author: 'דניאל כהן',
    date: '12/10/2023',
    replies: 3,
    likes: 5
  },
  {
    id: 2,
    title: 'שאלה על היברידיזציה של פחמן',
    content: 'אני מנסה להבין את ההיברידיזציה של פחמן באלקנים, אלקנים ואלקינים. האם מישהו יכול להסביר את ההבדלים בין sp3, sp2 ו-sp ואיך זה משפיע על המבנה המרחבי של המולקולה?',
    author: 'מיכל לוי',
    date: '10/10/2023',
    replies: 2,
    likes: 4
  },
  {
    id: 3,
    title: 'בעיה בתרגיל על חומצות קרבוקסיליות',
    content: 'אני עובד על תרגיל שבו צריך לסדר חומצות קרבוקסיליות לפי חומציות. אני לא מצליח להבין איך הקבוצות השונות משפיעות על החומציות. האם מישהו יכול לעזור?',
    author: 'יוסי אברהם',
    date: '05/10/2023',
    replies: 5,
    likes: 7
  }
];

// Add these new styled components
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
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  direction: rtl;
`;

const ModalTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-top: 0;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  font-family: inherit;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  
  &.primary {
    background-color: ${props => props.theme.colors.accent};
    color: white;
    
    &:hover {
      background-color: #0077ED;
    }
  }
  
  &.secondary {
    background-color: #f0f0f0;
    color: #333;
    
    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

const ReplyList = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const Reply = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReplyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const ReplyAuthor = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
`;

const ReplyDate = styled.span`
  color: ${props => props.theme.colors.gray};
  font-size: 14px;
`;

const ReplyContent = styled.p`
  margin: 0;
  line-height: 1.5;
`;

// Add this styled component definition
const InputGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: ${props => props.theme.colors.primary};
  }
  
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.accent};
    }
  }
`;

// Update the Forum component
const Forum = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newReplyContent, setNewReplyContent] = useState('');
  
  // שימוש ב-localStorage לשמירת השאלות והתגובות
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem('forumQuestions');
    return savedQuestions ? JSON.parse(savedQuestions) : sampleQuestions;
  });
  
  // שמירת השאלות ב-localStorage בכל פעם שהן משתנות
  React.useEffect(() => {
    localStorage.setItem('forumQuestions', JSON.stringify(questions));
  }, [questions]);
  
  // מעקב אחרי לייקים שהמשתמש כבר עשה
  const [likedQuestions, setLikedQuestions] = useState(() => {
    const savedLikes = localStorage.getItem('likedQuestions');
    return savedLikes ? JSON.parse(savedLikes) : [];
  });
  
  React.useEffect(() => {
    localStorage.setItem('likedQuestions', JSON.stringify(likedQuestions));
  }, [likedQuestions]);
  
  // שם המשתמש - במקרה אמיתי זה יגיע ממערכת ההרשמה
  const currentUser = "עמית אלבז"; // אפשר לשנות לכל שם שתרצה
  
  // Function to handle creating a new question
  const handleCreateQuestion = () => {
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;
    
    const newQuestion = {
      id: Date.now(), // שימוש בחותמת זמן לייצור מזהה ייחודי
      title: newQuestionTitle,
      content: newQuestionContent,
      author: currentUser, // שימוש בשם המשתמש במקום 'אורח'
      date: new Date().toLocaleDateString('he-IL'),
      replies: 0,
      likes: 0,
      replyList: []
    };
    
    setQuestions([newQuestion, ...questions]);
    setNewQuestionTitle('');
    setNewQuestionContent('');
    setShowNewQuestionModal(false);
  };
  
  // Function to handle adding a reply
  const handleAddReply = () => {
    if (!newReplyContent.trim() || !currentQuestion) return;
    
    const updatedQuestions = questions.map(q => {
      if (q.id === currentQuestion.id) {
        const replyList = q.replyList || [];
        const updatedQuestion = {
          ...q,
          replies: q.replies + 1,
          replyList: [
            ...replyList,
            {
              id: Date.now(), // שימוש בחותמת זמן לייצור מזהה ייחודי
              content: newReplyContent,
              author: currentUser, // שימוש בשם המשתמש במקום 'אורח'
              date: new Date().toLocaleDateString('he-IL')
            }
          ]
        };
        return updatedQuestion;
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
    setNewReplyContent('');
    setShowReplyModal(false);
  };
  
  // Function to handle likes - מאפשר לייק רק פעם אחת
  const handleLike = (questionId) => {
    // בדיקה אם המשתמש כבר עשה לייק לשאלה זו
    if (likedQuestions.includes(questionId)) {
      return; // אם כבר עשה לייק, לא עושים כלום
    }
    
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return { ...q, likes: q.likes + 1 };
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
    setLikedQuestions([...likedQuestions, questionId]); // הוספת השאלה לרשימת הלייקים של המשתמש
  };
  
  // Function to open reply modal
  const openReplyModal = (question) => {
    setCurrentQuestion(question);
    setShowReplyModal(true);
  };
  
  // פונקציה משופרת לחיפוש - מחפשת גם בתגובות
  const filterQuestions = (question) => {
    if (!searchTerm) return true;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // חיפוש בכותרת ובתוכן השאלה
    if (
      question.title.toLowerCase().includes(lowerSearchTerm) || 
      question.content.toLowerCase().includes(lowerSearchTerm)
    ) {
      return true;
    }
    
    // חיפוש בתגובות
    if (question.replyList && question.replyList.length > 0) {
      return question.replyList.some(reply => 
        reply.content.toLowerCase().includes(lowerSearchTerm) ||
        reply.author.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    return false;
  };
  
  return (
    <ForumContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        פורום שאלות ותשובות
      </PageTitle>
      
      <PageSubtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        ברוכים הבאים לפורום השאלות והתשובות שלנו. כאן תוכלו לשאול שאלות בנושאי כימיה אורגנית, לענות לשאלות של אחרים ולהשתתף בדיונים מקצועיים.
      </PageSubtitle>
      
      <ForumActions>
        <NewQuestionButton onClick={() => setShowNewQuestionModal(true)}>
          <FaComment /> שאלה חדשה
        </NewQuestionButton>
        
        <SearchBar>
          <input 
            type="text" 
            placeholder="חיפוש שאלות..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>חיפוש</button>
        </SearchBar>
      </ForumActions>
      
      <QuestionsList>
        {questions
          .filter(filterQuestions) // שימוש בפונקציית הסינון המשופרת
          .map((question) => (
          <QuestionCard
            key={question.id}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <QuestionHeader>
              <QuestionTitle>{question.title}</QuestionTitle>
              <QuestionStats>
                <span><FaComment /> {question.replies} תגובות</span>
                <span><FaThumbsUp /> {question.likes} לייקים</span>
              </QuestionStats>
            </QuestionHeader>
            
            <QuestionMeta>
              <span><FaUser /> {question.author}</span>
              <span><FaClock /> {question.date}</span>
            </QuestionMeta>
            
            <QuestionContent>{question.content}</QuestionContent>
            
            {question.replyList && question.replyList.length > 0 && (
              <ReplyList>
                {question.replyList.map(reply => (
                  <Reply key={reply.id}>
                    <ReplyHeader>
                      <ReplyAuthor>{reply.author}</ReplyAuthor>
                      <ReplyDate>{reply.date}</ReplyDate>
                    </ReplyHeader>
                    <ReplyContent>{reply.content}</ReplyContent>
                  </Reply>
                ))}
              </ReplyList>
            )}
            
            <QuestionFooter>
              <ActionButton onClick={() => openReplyModal(question)}>
                <FaReply /> הגב
              </ActionButton>
              <ActionButton 
                onClick={() => handleLike(question.id)}
                style={{ 
                  color: likedQuestions.includes(question.id) ? 
                    '#ff6b6b' : props => props.theme.colors.accent 
                }}
              >
                <FaThumbsUp /> {likedQuestions.includes(question.id) ? 'אהבתי' : 'לייק'}
              </ActionButton>
            </QuestionFooter>
          </QuestionCard>
        ))}
      </QuestionsList>
      
      {/* New Question Modal */}
      <AnimatePresence>
        {showNewQuestionModal && (
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
              <ModalTitle>שאלה חדשה</ModalTitle>
              <InputGroup>
                <label>כותרת:</label>
                <input 
                  type="text" 
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="הכנס כותרת לשאלה"
                />
              </InputGroup>
              <InputGroup>
                <label>תוכן השאלה:</label>
                <TextArea 
                  value={newQuestionContent}
                  onChange={(e) => setNewQuestionContent(e.target.value)}
                  placeholder="פרט את השאלה שלך כאן..."
                />
              </InputGroup>
              <ButtonGroup>
                <Button className="primary" onClick={handleCreateQuestion}>פרסם שאלה</Button>
                <Button className="secondary" onClick={() => setShowNewQuestionModal(false)}>ביטול</Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && currentQuestion && (
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
              <ModalTitle>הגב לשאלה: {currentQuestion.title}</ModalTitle>
              <InputGroup>
                <label>התגובה שלך:</label>
                <TextArea 
                  value={newReplyContent}
                  onChange={(e) => setNewReplyContent(e.target.value)}
                  placeholder="כתוב את התגובה שלך כאן..."
                />
              </InputGroup>
              <ButtonGroup>
                <Button className="primary" onClick={handleAddReply}>פרסם תגובה</Button>
                <Button className="secondary" onClick={() => setShowReplyModal(false)}>ביטול</Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </ForumContainer>
  );
};

export default Forum;