import React from "react";
import QuizForm from "../components/QuizForm";
import QuizList from "../components/QuizList";
import { useState, useEffect } from "react";
import Analytics from "../components/Analytics";
import { getQuizzes } from "../services/api";
import styles from "./Dashboard.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [showDashboard, setShowDashboard] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showEditQuiz, setShowEditQuiz] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let quizId = localStorage.getItem("quizId");
  let shareLink = "";
  const handleDashboard = () => {
    setShowDashboard(true);
    setShowAnalytics(false);
    setShowCreateQuiz(false);
    console.log(showDashboard, showAnalytics, showCreateQuiz);
  };
  const handleAnalytics = () => {
    setShowDashboard(false);
    setShowAnalytics(true);
    setShowCreateQuiz(false);
    setShowAnalysis(false)
    console.log(showDashboard, showAnalytics, showCreateQuiz);
  };
  const handleCreateQuiz = () => {
    setShowCreateQuiz(true);
    setEditQuiz(null);
    console.log(showDashboard, showAnalytics, showCreateQuiz);
  };

  useEffect(() => {
    fetchQuizzes();
  }, [showDashboard, showAnalytics, showCreateQuiz]);
  const fetchQuizzes = async () => {
    try {
      const response = await getQuizzes(token);
      setQuizzes(response.data);
      console.log(quizzes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (quiz) => {
    setEditQuiz(quiz);
    console.log(quiz);
    setShowEditQuiz(true);
  };

  const handleShare = (id) => {
    console.log(id)
    shareLink = `http://localhost:5173/quiz/${id}`;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        console.log("shareLink", shareLink);
        toast.success('Link copied to Clipboard')

      })
      .catch((err) => {
        console.error("Failed to copy the link: ", err);
      });
  };

  const handleLogout = ()=>{
    localStorage.removeItem('id')
    localStorage.removeItem('quizId')
    localStorage.removeItem('token')
    localStorage.removeItem('userID')
    localStorage.removeItem('userName')
    navigate('/')
  }

  return (
    <div className={styles.mainContainer} >
      <div className={styles.menuContainer}>
        <div className={styles.heading}>
          <h1>QUIZZIE</h1>
        </div>

        <div className={styles.container}>
          <button className={`${styles.buttons} ${showDashboard && styles.shadow}`} onClick={handleDashboard}>Dashboard</button>
          <button className={`${styles.buttons} ${showAnalytics && styles.shadow}`}  onClick={handleAnalytics}>Analytics</button>
          <button className={`${styles.buttons} ${showCreateQuiz && styles.shadow}`}  onClick={handleCreateQuiz}>Create Quize</button>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.logout} onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>

      <div className={styles.parent}>
        {showDashboard && (
          <div>
            <QuizList quizzes={quizzes} />
          </div>
        )}
        {showAnalytics && (
          <div>
            <Analytics
              quizzes={quizzes}
              setQuizzes={setQuizzes}
              handleShare={handleShare}
              shareLink={shareLink}
              setShowCreateQuiz={setShowCreateQuiz}
              showEditQuiz={showEditQuiz}
              setShowEditQuiz= {setShowEditQuiz}
              handleEdit={handleEdit}
              editQuiz={editQuiz}
              showAnalysis = {showAnalysis}
              setShowAnalysis = {setShowAnalysis}
            />
          </div>
        )}
        {showCreateQuiz && (
          <div>
            <QuizForm
              handleShare={handleShare}
              shareLink={shareLink}
              setShowCreateQuiz={setShowCreateQuiz}
              editQuiz={editQuiz}
              setShowEditQuiz = {setShowEditQuiz}
            />
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
