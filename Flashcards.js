import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FaSync, FaArrowRight } from 'react-icons/fa';
import { FlashcardsContext } from '../context/FlashcardsContext';
import { NavbarContext } from '../context/NavbarContext'; // Add this import
import Confetti from 'react-confetti'; // Make sure this import is here


const youngCardIntervals = {
  1: 3,     // לא ידעתי - 3 minutes
  2: 10,    // דרוש רענון - 10 minutes
  3: 1,     // סביר - 1 day
  4: 4,     // ידעתי הכל - 4 days
};

// עדכון הזמנים לכרטיסים בוגרים
const matureCardIntervals = {
  1: 3,     // לא ידעתי - 3 minutes
  2: 1,     // דרוש רענון - 1 day
  3: 10,    // סביר - 10 days
  4: 14,    // ידעתי הכל - 14 days (2 weeks)
};

// Update the labels
const ratingLabels = {
  1: "לא ידעתי",
  2: "דרוש רענון",
  3: "סביר",
  4: "ידעתי הכל"
};

// Update the time units
const youngCardTimeUnits = {
  1: "m",  // minutes
  2: "m",  // minutes
  3: "d",  // days
  4: "d",  // days
};

const matureCardTimeUnits = {
  1: "m",  // minutes
  2: "d",  // days
  3: "d",  // days
  4: "d",  // days
};

// Modify the FlashcardsContainer to have a fixed height and better positioning
const FlashcardsContainer = styled.div`
  padding: ${props => props.navbarHidden ? '0' : '80px 0 0'};
  margin: 0 auto;
  direction: rtl;
  transition: padding 0.3s ease;
  position: ${props => props.studyMode ? 'fixed' : 'static'};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: ${props => props.studyMode ? 'hidden' : 'visible'};
  width: 100%;
  height: ${props => props.studyMode? '100vh' : 'auto'};
  max-width: 100%;
  display: ${props => props.studyMode ? 'flex' : 'block'};
  flex-direction: ${props => props.studyMode ? 'column' : 'row'};
  justify-content: ${props => props.studyMode ? 'space-between' : 'flex-start'};
  align-items: ${props => props.studyMode ? 'center' : 'stretch'};
  box-sizing: border-box;
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

// Update the FlashcardWrapper to take up more vertical space
const FlashcardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 80px; /* רק משאיר מקום לנאבבר בתחתית */
  box-sizing: border-box;
  padding: 0;
`;

// עדכון ה-FlashcardContainer כדי שיתפוס את כל המסך
const FlashcardContainer = styled.div`
  width: 100%;
  height: 100%;
  perspective: 1000px;
  box-sizing: border-box;
`;

const BottomNavbar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f8f9fa;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  height: 80px;
  box-sizing: border-box;
`;

// Create a new component for the progress info that will be positioned above the navbar
const ProgressInfoContainer = styled.div`
  position: fixed;
  bottom: 80px; // Position it right above the navbar
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: transparent; // Changed from rgba(248, 249, 250, 0.9) to transparent
  padding: 5px 0;
  border-top: none; // Removed the border
  z-index: 999; // Just below the navbar z-index
`;

// Make the buttons more compact
const FlipButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 16px;
  margin-top: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #0077ED;
  }
`;

// עדכון ה-RatingContainer כדי שיתאים ל-navbar בתחתית
const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 100%;
  max-width: 700px;
`;

// Make the progress info smaller and more compact
const ProgressInfo = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${props => props.theme.colors.gray};
  display: flex;
  align-items: center;
  gap: 5px;
  
  .total-cards {
    color: #4caf50;
    font-weight: bold;
  }
  
  .card-types {
    display: flex;
    gap: 15px;
  }
  
  .card-type {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .card-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .new-card {
    background-color: #9e9e9e; /* אפור - כרטיסיות חדשות */
  }
  
  .young-card {
    background-color: #f44336; /* אדום - כרטיסיות צעירות */
  }
  
  .mature-card {
    background-color: #4caf50; /* ירוק - כרטיסיות בוגרות */
  }
  
  .current-card-indicator {
    font-weight: bold;
    margin-left: 5px;
  }
`;

// Make the back button smaller and less intrusive
const BackButton = styled(motion.button)`
  background-color: transparent;
  color: ${props => props.theme.colors.accent};
  border: 1px solid ${props => props.theme.colors.accent};
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  position: fixed; /* שינוי מ-absolute ל-fixed */
  top: 10px;
  right: 10px;
  z-index: 1000; /* הוספת z-index גבוה */
  
  &:hover {
    background-color: rgba(0, 119, 237, 0.1);
  }
`;

const FlashcardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transform-style: preserve-3d;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  cursor: default; /* שינוי מ-pointer ל-default */
  user-select: none; /* מניעת בחירת טקסט */
`;

const FlashcardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 96%;
  backface-visibility: hidden;
  border-radius: 0; /* הסרת העיגול בפינות */
  box-shadow: none; /* הסרת הצל */
  padding: 60px 20px 20px; /* פדינג מוגדל בחלק העליון עבור כפתור החזרה */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* שינוי מ-center ל-flex-start כדי להציג את התוכן למעלה */
  align-items: center; /* מרכוז אופקי */
  overflow-y: auto; /* אפשר גלילה אנכית */
  scrollbar-width: thin; /* עבור Firefox */
  user-select: none; /* מניעת בחירת טקסט */
  
  /* מניעת גרירה של תמונות */
  img {
    pointer-events: none;
    -webkit-user-drag: none;
  }
  
  /* עיצוב עבור דפדפני webkit (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const FlashcardFront = styled(FlashcardSide)`
  background-color: #f2f5f8;
  color: ${props => props.theme.colors.primary};
`;

const FlashcardBack = styled(FlashcardSide)`
  background-color: #f2f5f8;
  color: ${props => props.theme.colors.primary};
  transform: rotateY(180deg);
`;

const FlashcardQuestion = styled.h2`
  font-size: 32px;
  margin-top: 20px; /* הוספת מרווח עליון */
  margin-bottom: 30px;
  width: 90%; /* Ensure there's space for scrolling */
  text-align: center; /* מרכוז טקסט */
  img {
    max-width: 100%;
    max-height: 1000px;
    margin: 20px 0;
    border-radius: 8px;
  }
`;

// Update the FlashcardAnswer to have better top margin and centered text
const FlashcardAnswer = styled.div`
  font-size: 20px;
  line-height: 1.6;
  width: 90%; /* Ensure there's space for scrolling */
  margin-top: 20px; /* הוספת מרווח עליון */
  text-align: center; /* מרכוז טקסט */
  
  img {
    max-width: 100%;
    max-height: 1000px;
    margin: 20px 0;
    border-radius: 8px;
  }
  
  p {
    margin-bottom: 15px;
    text-align: center; /* מרכוז טקסט בפסקאות */
  }
  
  ul, ol {
    padding-right: 20px;
    margin-bottom: 15px;
    display: inline-block; /* גורם לרשימות להיות ממורכזות */
    text-align: right; /* אבל הטקסט בתוכן מיושר לימין */
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 15px;
    margin-left: auto;
    margin-right: auto;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: right;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  blockquote {
    border-right: 3px solid #ccc;
    margin: 0 0 15px 0;
    padding: 0 15px;
    color: #666;
    text-align: right; /* יישור טקסט לימין בציטוטים */
  }
`;

const FlashcardImage = styled.img`
  max-width: 100%;
  max-height: 1000px;
  margin: 20px 0;
  border-radius: 8px;
`;



const RatingTitle = styled.h3`
  font-size: 18px;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 10px;
`;

const RatingButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 8px; // הקטנת הרווח בין הכפתורים מ-10px ל-8px
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const RatingButton = styled(motion.button)`
  flex: 1;
  padding: 12px 8px; // הקטנת הפדינג מ-15px 10px ל-12px 8px
  border: none;
  border-radius: 8px;
  font-size: 13px; // הקטנת גודל הפונט מ-14px ל-13px
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px; // הקטנת הרווח בין הטקסטים מ-5px ל-3px
  
  .days {
    font-size: 11px; // הקטנת גודל הפונט מ-12px ל-11px
    opacity: 0.8;
  }
  
  &:nth-child(1) {
    background-color:rgb(219, 69, 69); /* אדום - לא ידעתי - פחות זרחני */
    color: white;
  }
  
  &:nth-child(2) {
    background-color:rgb(230, 135, 40); /* כתום - דרוש רענון - פחות זרחני */
    color: white;
  }
  
  &:nth-child(3) {
    background-color:rgb(42, 124, 206); /* כחול - סביר - פחות זרחני */
    color: white;
  }
  
  &:nth-child(4) {
    background-color:rgb(56, 183, 113); /* ירוק - ידעתי הכל - פחות זרחני */
    color: white;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;


// Deck Selection Styled Components
const DeckSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const DeckGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: 30px 0;
`;

// Update the DeckCard component to include subject information
const DeckCard = styled.div`
  background-color:rgb(255, 255, 255);
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? props.theme.colors.accent : 'transparent'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const DeckTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.primary};
`;

// Add a new styled component for the subject tag
const SubjectTag = styled.span`
  display: inline-block;
  background-color: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
`;

const DeckInfo = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.gray};
`;

const StartButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background-color: #0077ED;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;


// Add this new styled component for the completion screen
// Update the CompletionScreen styled component to have a lower z-index than the confetti
const CompletionScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e7f6ff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 900; // Lower z-index so confetti appears above
  text-align: center;
  padding: 20px;
`;

const CompletionMessage = styled.h2`
  font-size: 36px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 20px;
`;

const CompletionSubtext = styled.p`
  font-size: 18px;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 30px;
`;

const CloseButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
`;

const Flashcards = () => {
  const { currentUser } = useContext(AuthContext);
  const { decks, getCardsByDeck, updateCardReview, saveCompletedCards, getCompletedCards } = useContext(FlashcardsContext);
  const { navbarVisible, setNavbarVisible } = useContext(NavbarContext); // Get both values
  const [cardTypes, setCardTypes] = useState({
    new: 0,
    young: 0,
    mature: 0
  });
  // Change from single selectedDeckId to array of selected deck IDs
  const [selectedDeckIds, setSelectedDeckIds] = useState([]);
  const [currentCards, setCurrentCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [completedTodayCards, setCompletedTodayCards] = useState([]);
  const [studyMode, setStudyMode] = useState(false);
  const [deckCardCounts, setDeckCardCounts] = useState({});
  // Add the missing state for confetti
  const [showConfetti, setShowConfetti] = useState(false);
  // Add the missing state for completion screen
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  
  const currentCard = currentCards.length > 0 ? currentCards[currentCardIndex] : null;
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && studyMode && !showCompletionScreen) {
        e.preventDefault(); // מניעת גלילה של הדף
        
        if (isFlipped) {
          // אם הכרטיסייה הפוכה, נחזיר אותה לצד השאלה
          setIsFlipped(false);
          setShowRating(false);
        } else {
          // אם הכרטיסייה בצד השאלה, נהפוך אותה לצד התשובה
          handleFlip();
        }
      }
    };
        window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [studyMode, isFlipped, showCompletionScreen]);
  useEffect(() => {
    if (currentUser && decks.length > 0) {
      const loadAllDeckCounts = async () => {
        const counts = {};
        const allCompletedCards = {};
        
        for (const deck of decks) {
          // קבל את הכרטיסיות שהושלמו היום עבור חפיסה זו
          const completedCards = await getCompletedCards(currentUser.uid, deck.id);
          const today = new Date().toDateString();
          
          // Make sure completedCards is an array before using filter
          const todayCards = Array.isArray(completedCards)
            ? completedCards.filter(card => 
                new Date(card.completedDate).toDateString() === today
              )
            : [];
            
          allCompletedCards[deck.id] = todayCards.map(card => card.cardId);
          
          // חשב את מספר הכרטיסיות הזמינות
          const deckCards = getCardsByDeck(deck.id);
          console.log(`Deck ${deck.id} (${deck.name}) has ${deckCards.length} total cards`);
          
          const now = new Date();
          const dueCards = deckCards.filter(card => {
            const isDue = !card.nextReviewDate || new Date(card.nextReviewDate) <= now;
            const isCompleted = allCompletedCards[deck.id].includes(card.id);
            return isDue && !isCompleted;
          });
          
          console.log(`Deck ${deck.id} (${deck.name}) has ${dueCards.length} due cards`);
          counts[deck.id] = dueCards.length;
        }
        
        setDeckCardCounts(counts);
      };
      
      loadAllDeckCounts();
    }
  }, [currentUser, decks, getCompletedCards, getCardsByDeck]);

  // First, let's fix the getCardType function to be more accurate
  const getCardType = (card) => {
    // If the card has never been reviewed, it's new
    if (!card.reviewCount || card.reviewCount === 0) {
      return 'new';
    } 
    // If the card has been reviewed 1-2 times, it's young
    else if (card.reviewCount < 3) {
      return 'young';
    } 
    // Otherwise it's mature
    else {
      return 'mature';
    }
  };

  // Add the missing functions
  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setShowRating(true);
    }
  };
  
  // פונקציה לחזרה למסך בחירת החפיסה
  const backToDeckSelection = () => {
    window.location.reload();
  };
  
  // Handle toggling deck selection
  const toggleDeckSelection = (deckId) => {
    if (selectedDeckIds.includes(deckId)) {
      setSelectedDeckIds(selectedDeckIds.filter(id => id !== deckId));
    } else {
      setSelectedDeckIds([...selectedDeckIds, deckId]);
    }
  };
  
  // Add a helper function to check if all cards are completed
  const areAllCardsCompleted = () => {
    const totalRemainingCards = cardTypes.new + cardTypes.young + cardTypes.mature;
    return totalRemainingCards < 1;
  };
  
  const startStudySession = () => {
    if (selectedDeckIds.length > 0) {
      // טען את כל הכרטיסיות מהחפיסות שנבחרו
      const allCards = [];
      const cardTypeCount = { new: 0, young: 0, mature: 0 };
      
      console.log("Starting study session with selected decks:", selectedDeckIds);
      
      // עבור על כל החפיסות שנבחרו
      for (const deckId of selectedDeckIds) {
        // קבל את כל הכרטיסיות של החפיסה
        const deckCards = getCardsByDeck(deckId);
        console.log(`Loading cards for deck ${deckId}: found ${deckCards.length} cards`);
        
        // קבל את הכרטיסיות שהושלמו היום
        const completedCards = getCompletedCards(currentUser.uid, deckId);
        const today = new Date().toDateString();
        
        // Make sure completedCards is an array before using filter
        const todayCompletedCardIds = Array.isArray(completedCards) 
          ? completedCards
              .filter(card => new Date(card.completedDate).toDateString() === today)
              .map(card => card.cardId)
          : [];
        
        console.log(`Completed cards for deck ${deckId}:`, todayCompletedCardIds.length);
        
        // סנן רק כרטיסיות שזמינות היום (לא הושלמו היום ומועד הסקירה הבא הוא היום או עבר)
        const now = new Date();
        const dueCards = deckCards.filter(card => {
          const isDue = !card.nextReviewDate || new Date(card.nextReviewDate) <= now;
          const isCompleted = todayCompletedCardIds.includes(card.id);
          return isDue && !isCompleted;
        });
        
        console.log(`Due cards for deck ${deckId}: ${dueCards.length}`);
        
        // הוסף את ה-deckId לכל כרטיסייה
        const cardsWithDeckId = dueCards.map(card => ({
          ...card,
          deckId: deckId
        }));
        
        // הוסף את הכרטיסיות למערך הכללי
        allCards.push(...cardsWithDeckId);
        
        // עדכן את ספירת סוגי הכרטיסיות
        cardsWithDeckId.forEach(card => {
          const type = getCardType(card);
          cardTypeCount[type]++;
        });
      }
      
      console.log(`Total cards loaded: ${allCards.length}`);
      console.log('Card types:', cardTypeCount);
      
      // עדכן את הסטייט
      setCurrentCards(allCards);
      setCardTypes(cardTypeCount);
      setCurrentCardIndex(0);
      setStudyMode(true);
      setNavbarVisible(false); // Hide navbar in study mode
      setCompletedTodayCards([]);
      setShowCompletionScreen(false); // Reset completion screen
      setShowConfetti(false); // Reset confetti
    }
  };

  // Now let's fix the handleRating function
  const handleRating = (rating) => {
    if (!currentCard || !currentUser) return;
    
    // וודא שהכרטיסייה שייכת לאחת החפיסות שנבחרו
    if (!selectedDeckIds.includes(currentCard.deckId)) {
      console.error("Card doesn't belong to selected decks:", currentCard);
      // Skip to next card
      if (currentCardIndex < currentCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setShowCompletionScreen(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 15000);
      }
      setIsFlipped(false);
      setShowRating(false);
      return;
    }
    
    const isYoungCard = 
      (currentCard.reviewCount === undefined || currentCard.reviewCount < 2) && 
      (!currentCard.maxInterval || currentCard.maxInterval < 4);
    
    const intervals = isYoungCard ? youngCardIntervals : matureCardIntervals;
    const timeUnits = isYoungCard ? youngCardTimeUnits : matureCardTimeUnits;
    
    const newInterval = intervals[rating];
    const nextReviewDate = new Date();
    
    if (timeUnits[rating] === "m") {
      nextReviewDate.setMinutes(nextReviewDate.getMinutes() + newInterval);
    } else {
      nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
    }
    
    const newReviewCount = (currentCard.reviewCount || 0) + 1;
  
    updateCardReview(currentCard.id, rating, nextReviewDate, newReviewCount);

    // Create a copy of the current cards array first
    const updatedCards = [...currentCards];

    // Create a copy of the current card with updated values
    const updatedCard = {
      ...currentCard,
      reviewCount: newReviewCount, // Use the same newReviewCount value here
      lastRating: rating,
      nextReviewDate
    };
    
    // Get the card type before and after the update
    const oldType = getCardType(currentCard);
    const newType = getCardType(updatedCard);
    
    console.log(`Card ${currentCard.id} changing from ${oldType} to ${newType}`);
    console.log(`Review count: ${currentCard.reviewCount || 0} -> ${newReviewCount}`);
    
    // בדוק אם הכרטיסייה מתוזמנת למחר או מאוחר יותר
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // אם הכרטיסייה מתוזמנת למחר או מאוחר יותר, הוסף אותה לרשימת הכרטיסיות שהושלמו היום
    // והסר אותה מהספירה של היום
    if (nextReviewDate >= tomorrow) {
      // עדכן את הסטייט הקומי
      const updatedCompletedCards = [...completedTodayCards, currentCard.id];
      setCompletedTodayCards(updatedCompletedCards);
      
      // שמור ב-Firestore - use the card's deckId
      saveCompletedCards(currentUser.uid, currentCard.deckId, currentCard.id, new Date());
      
      // עדכן את ספירת סוגי הכרטיסיות - הפחת את הספירה של הסוג הישן
      // כי הכרטיסייה כבר לא זמינה להיום
      const updatedCardTypes = {
        ...cardTypes,
        [oldType]: Math.max(0, cardTypes[oldType] - 1)
      };
      
      // בדוק אם הכרטיסייה הפכה מצעירה לבוגרת לאחר העדכון
      // אם כן, עדכן את הספירה של הכרטיסיות הבוגרות גם כן
      if (oldType === 'young' && newType === 'mature') {
        console.log(`Card ${currentCard.id} transitioning from young to mature`);
        // אין צורך להוסיף לספירת הבוגרות כי הכרטיסייה לא תהיה זמינה היום
      }
      
      console.log('Updated card types after scheduling for future:', updatedCardTypes);
      setCardTypes(updatedCardTypes);
    } else {
      // אם הכרטיסייה עדיין זמינה להיום, עדכן את הספירה רק אם הסוג השתנה
      if (oldType !== newType) {
        // Create a deep copy of the current card types to avoid state update issues
        const updatedCardTypes = {
          ...cardTypes,
          [oldType]: Math.max(0, cardTypes[oldType] - 1),
          [newType]: cardTypes[newType] + 1
        };
        
        console.log('Updated card types after type change:', updatedCardTypes);
        setCardTypes(updatedCardTypes);
      }
    }

    // Update the card in the array
    updatedCards[currentCardIndex] = updatedCard;
    
    // אם הדירוג הוא "לא ידעתי" (1), הזז את הכרטיסייה לסוף התור
    if (rating === 1) {
      // הסר את הכרטיסייה הנוכחית
      updatedCards.splice(currentCardIndex, 1);
      
      // הוסף אותה בסוף התור
      updatedCards.push(updatedCard);
      
      // עדכן את מערך הכרטיסיות
      setCurrentCards(updatedCards);
      
      // אם זו הכרטיסייה האחרונה, חזור להתחלה
      if (currentCardIndex < updatedCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        // סיימנו את כל הכרטיסיות
        setShowCompletionScreen(true);
        setCurrentCardIndex(0);
        
        // Show confetti only if all cards are completed
        if (areAllCardsCompleted()) {
          setShowConfetti(true);
          
          // Hide confetti after 15 seconds
          setTimeout(() => {
            setShowConfetti(false);
          }, 15000);
        }
      }
    }
    
    // Reset the card state
    setIsFlipped(false);
    setShowRating(false);
  };

  const closeCompletionScreen = () => {
    setShowCompletionScreen(false);
    backToDeckSelection();
  };
  // Add state to track which subjects are expanded - initialize with all subjects expanded
  const [expandedSubjects, setExpandedSubjects] = useState({
    physiology: false,
    biochemistry: false,
    cellbiology: false,
    molecularbiology: false,
    other: false
  });
  
  // Function to toggle subject expansion
  const toggleSubjectExpansion = (subject) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  // Update the deck selection UI
  if (!studyMode) {
    // Filter decks to show both user's own decks and public decks
    const availableDecks = decks;
    
    // Group decks by subject
    const decksBySubject = {};
    availableDecks.forEach(deck => {
      const subject = deck.subject || 'other';
      if (!decksBySubject[subject]) {
        decksBySubject[subject] = [];
      }
      decksBySubject[subject].push(deck);
    });
    
    // Define subject display names, colors and order
    const subjectOrder = ['physiology', 'biochemistry', 'cellbiology', 'molecularbiology', 'other'];
    const subjectNames = {
      'physiology': 'פיזיולוגיה',
      'biochemistry': 'ביוכימיה',
      'cellbiology': 'ביולוגיה של התא',
      'molecularbiology': 'ביולוגיה מולקולרית',
      'other': 'נושאים אחרים'
    };
    
    // Define colors for each subject
    const subjectColors = {
      'physiology': {
        header: 'rgb(255, 229, 224)', // Light blue background
        text: '#3a3a3a',   // Dark orange text
        border: '#ffe0b2', // Border color
        card: '#fffaf5'    // Very light orange for cards
      },
      'biochemistry': {
        header: ' #e3f2fd', // Light yellow/green background
        text: '#3a3a3a',   // Darker blue text
        border: '#bbdefb', // Border color
        card: '#f5f9ff'    // Very light blue for cards

      },
      'cellbiology': {
        header: ' #e8f5e9', // Light green background
        text: ' #3a3a3a',   // Dark green text
        border: '#c8e6c9', // Border color
        card: '#f4fbf4'    // Very light green for cards
      },
      'molecularbiology': {
        header: ' #f9fbe7', // Light orange background
        text: ' #3a3a3a',   // Olive text
        border: ' #f0f4c3', // Border color
        card: ' #fafdf2'    // Very light yellow for cards

      },
      'other': {
        header: '#f5f5f5', // Light gray background
        text: '#616161',   // Dark gray text
        border: '#e0e0e0', // Border color
        card: '#fafafa'    // Very light gray for cards
      }
    };
      // סך בחירת חפיסה
      return (
        <FlashcardsContainer navbarHidden={!navbarVisible}>
          <PageTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            כרטיסיות לימוד
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            בחר חפיסת כרטיסיות ללימוד בשיטת החזרה המרווחת
          </PageSubtitle>
          <DeckSelectionContainer>
            {/* Render subjects in specific order */}
            {subjectOrder.map(subject => {
              // Only show subjects that have decks
              if (!decksBySubject[subject] || decksBySubject[subject].length === 0) return null;
              
              const isExpanded = expandedSubjects[subject] === true;
              const colors = subjectColors[subject];
              
              return (
                <div key={subject} style={{ 
                  width: '100%', 
                  marginBottom: '20px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                  border: `1px solid ${colors.border}`
                }}>
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '18px 20px',
                      backgroundColor: colors.header,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => toggleSubjectExpansion(subject)}
                  >
                    <h2 style={{ 
                      fontSize: '22px', 
                      margin: 0,
                      fontWeight: '600',
                      color: colors.text,
                    }}>
                      {subjectNames[subject]}
                    </h2>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '15px',
                      fontSize: '16px',
                      color: colors.text,
                      opacity: 0.8
                    }}>
                      <span>{decksBySubject[subject].length} חפיסות</span>
                      <span>{decksBySubject[subject].reduce((total, deck) => 
                        total + (deckCardCounts[deck.id] || 0), 0)} כרטיסיות</span>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}>
                        {isExpanded ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div style={{
                      backgroundColor: colors.card,
                      padding: '15px 20px',
                      borderTop: `1px solid ${colors.border}`
                    }}>
                      <DeckGrid>
                        {decksBySubject[subject].map(deck => (
                          <DeckCard 
                            key={deck.id}
                            selected={selectedDeckIds.includes(deck.id)}
                            onClick={() => toggleDeckSelection(deck.id)}
                            style={{
                              borderLeft: `4px solid ${colors.text}`,
                              backgroundColor: 'white'
                            }}
                            >
                            <DeckTitle style={{ color: colors.text }}>
                              {deck.name}
                            </DeckTitle>
                            <DeckInfo>
                              {deckCardCounts[deck.id] !== undefined ? deckCardCounts[deck.id] : "..."} כרטיסיות זמינות להיום
                            </DeckInfo>
                          </DeckCard>
                        ))}
                      </DeckGrid>
                    </div>
                  )}
                </div>
              );
            })}
            
            <StartButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startStudySession}
              disabled={selectedDeckIds.length === 0}
            >
              התחל שינון ({selectedDeckIds.length > 0 ? `${selectedDeckIds.length} חפיסות` : 'בחר חפיסות'})
            </StartButton>
          </DeckSelectionContainer>
        </FlashcardsContainer>
      );
    }
    return (
      <FlashcardsContainer navbarHidden={!navbarVisible} studyMode={studyMode}>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={true}
            numberOfPieces={200}
            gravity={0.2}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
          />
        )}
    
        {/* Add the completion screen here */}
        {showCompletionScreen && (
          <CompletionScreen>
            <CompletionMessage>כל הכבוד! סיימת את כל הכרטיסיות</CompletionMessage>
            <CompletionSubtext>חזור מחר להמשך התרגול</CompletionSubtext>
            <CloseButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeCompletionScreen}
            >
              חזרה לבחירת חפיסות
            </CloseButton>
          </CompletionScreen>
        )}
    
        {/* Add the back button here for study mode */}
        {studyMode && !showCompletionScreen && (
          <BackButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={backToDeckSelection}
          >
            <FaArrowRight /> חזרה לבחירת חפיסה
          </BackButton>
        )}
        
        {/* Only show cards if not in completion screen */}
        {currentCards.length > 0 && !showCompletionScreen ? (
          <>
            <FlashcardWrapper studyMode={studyMode}>
              <FlashcardContainer studyMode={studyMode}>
                <FlashcardInner flipped={isFlipped}>
                  <FlashcardFront>
                    <FlashcardQuestion dangerouslySetInnerHTML={{ __html: currentCard.question || '' }} />
                  </FlashcardFront>
                  <FlashcardBack>
                    <FlashcardAnswer dangerouslySetInnerHTML={{ __html: currentCard.answer || '' }} />
                    {currentCard.image && (
                      <FlashcardImage src={currentCard.image} alt="תמונת הסבר" />
                    )}
                  </FlashcardBack>
                </FlashcardInner>
              </FlashcardContainer>
            </FlashcardWrapper>
          
          <ProgressInfoContainer>
            <ProgressInfo>              
              <div className="card-types">
                <div className="card-type">
                  <div className="card-indicator new-card"></div>
                  <span>חדשות: {cardTypes.new}</span>
                  {currentCard && getCardType(currentCard) === 'new' && <span className="current-card-indicator">←</span>}
                </div>
                
                <div className="card-type">
                  <div className="card-indicator young-card"></div>
                  <span>צעירות: {cardTypes.young}</span>
                  {currentCard && getCardType(currentCard) === 'young' && <span className="current-card-indicator">←</span>}
                </div>
                
                <div className="card-type">
                  <div className="card-indicator mature-card"></div>
                  <span>בוגרות: {cardTypes.mature}</span>
                  {currentCard && getCardType(currentCard) === 'mature' && <span className="current-card-indicator">←</span>}
                </div>
              </div>
            </ProgressInfo>
          </ProgressInfoContainer>
          
          <BottomNavbar>
            {!isFlipped ? (
              <FlipButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFlip}
              >
                הפוך כרטיסייה
              </FlipButton>
            ) : (
              <RatingContainer>
                <RatingButtons>
                  {[1, 2, 3, 4].map(rating => (
                    <RatingButton
                      key={rating}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRating(rating)}
                    >
                      {ratingLabels[rating]}
                      <span className="days">
                        {youngCardTimeUnits[rating] === "m" 
                          ? `${youngCardIntervals[rating]} דקות` 
                          : `${youngCardIntervals[rating]} ימים`}
                      </span>
                    </RatingButton>
                  ))}
                </RatingButtons>
              </RatingContainer>
            )}
          </BottomNavbar>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>אין כרטיסיות זמינות להיום בחפיסות שנבחרו</h3>
            <p>נסה לבחור חפיסות אחרות או חזור מחר</p>
          </div>
        )}
      </FlashcardsContainer>
    );
  };
  
  export default Flashcards;
  
  
  
  
  