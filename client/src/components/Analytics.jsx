import React from "react";
import QuizForm from "./QuizForm";
import { useState, useEffect } from "react";
import { handleDeleteQuiz } from "../services/api";
import QuetionAnalysis from "./QuetionAnalysis";
import styles from "../pages/Dashboard.module.css";
import edit from '../assets/edit.png'
import share from '../assets/share.png'
import deletebutton from '../assets/deletebutton.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Analytics = ({
  quizzes,
  setQuizzes,
  handleShare,
  shareLink,
  setShowCreateQuiz,
  showEditQuiz,
  setShowEditQuiz,
  handleEdit,
  editQuiz,
  showAnalysis, 
  setShowAnalysis
}) => {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [id, setID] = useState(0);
  const [quiz, setQuiz] = useState();
  const token = localStorage.getItem("token");

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const date = new Date(dateString).toLocaleDateString("en-GB", options);
    const [day, month, year] = date.split(" ");
    return `${day} ${month}, ${year}`;
  };

  const formatImpressions = (impressions) => {
    if (impressions < 1000) {
      return impressions;
    }
    return (impressions / 1000).toFixed(1) + "K";
  };
  const handelDelete = async (id) => {
    try {
      const res = await handleDeleteQuiz(id, token);
      console.log(res.status == 200);
      if (res.status == 200) {
        console.log("here");
        setQuizzes(quizzes.filter((quiz) => quiz._id != id));
        console.log(quizzes);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onQuestionAnalysis = (id, quiz) => {
    setShowAnalysis(true);
    setQuiz(quiz);
    setID(id);
  };


  return (
    <div className={styles.AnalyticsContainer}>
      {!showAnalysis && (
        <div  >
          <h2 className={styles.AnalyticsHeading}>Quiz Analysis</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Quiz Name</th>
                  <th>Created On</th>
                  <th>Impressions</th>
                  <th>Actions</th>
                  <th>Question Wise Analysis</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, index) => (
                  <tr key={quiz._id}>
                    <td>{index + 1}</td>
                    <td>{quiz.name}</td>
                    <td>{formatDate(quiz.createdAt)}</td>
                    <td>{formatImpressions(quiz.impressions)}</td>
                    <td>
                      <button className={styles.imageButton} onClick={() => handleEdit(quiz)}>
                        <img className={styles.images} src={edit} alt="edit" />
                      </button>
                      <button
                        className={styles.imageButton}
                        onClick={() => {
                          setShowConfirmPopup(true);
                          setID(quiz._id);
                        }}
                      >
                        <img
                        className={styles.images}
                        src={deletebutton} alt="deletebutton" />
                      </button>
                      <button
                      className={styles.imageButton}
                      onClick={() => handleShare(quiz._id)}>
                      <img 
                      className={styles.images}
                      src={share} alt="sharebutton" />
                      </button>
                    </td>
                    <td>
                      <a
                        href="#"
                        onClick={() => onQuestionAnalysis(quiz._id, quiz)}
                      >
                        Question Wise Analysis
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAnalysis && (
        <QuetionAnalysis
          id={id}
          quiz={quiz}
          formatDate={formatDate}
        />
      )}

      {showEditQuiz && (
        <QuizForm
          handleShare={handleShare}
          shareLink={shareLink}
          setShowCreateQuiz={setShowCreateQuiz}
          editQuiz={editQuiz}
          setShowEditQuiz = {setShowEditQuiz}
        />
      )}

      {showConfirmPopup && (
        <div className={styles.popupContainer}>
          <div className={styles.popup}>
            <p className={styles.popupPara}>
                Are you confirm you want to delete ?
            </p>
            <div className={styles.popupButtonDiv}>
              <div
                className={styles.popupButton}
                onClick={() => {
                  handelDelete(id);
                  setShowConfirmPopup(false);
                }}
              >
                Confirm Delete
              </div>
              <div
                className={styles.popupButton}
                onClick={() => setShowConfirmPopup(false)}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      )}

    <ToastContainer />
    </div>
  );
};

export default Analytics;
