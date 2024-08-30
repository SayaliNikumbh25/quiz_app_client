import React, { useState, useEffect } from "react";
import styles from "../pages/Dashboard.module.css";
import eye from "../assets/eye.png";

const QuizList = ({ quizzes }) => {
  const [totalQuiz, setTotalQuiz] = useState(0);
  const [totalQuetions, setTotalQuetions] = useState(0);
  const [totalImpressions, setTotalImpressions] = useState(0);

  useEffect(() => {
    let quetions = 0;
    let impressions = 0;
    quizzes.map((quiz) => {
      quetions += quiz.questions.length;
      impressions += quiz.impressions;
    });
    setTotalQuiz(quizzes.length);
    setTotalQuetions(quetions);
    setTotalImpressions(impressions);
  }, [quizzes]);

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
    return `${(impressions / 1000).toFixed(1)}K`;
  };

  return (
    <div className={styles.dashBoardContainer}>
      <div className={styles.section1}>
        <div className={styles.countsDiv}>
          <p className={styles.countInfo} style={{ color: "#FF5D01" }}>
            {" "}
            <span className={styles.count} style={{ color: "#FF5D01" }}>
              {totalQuiz}{" "}
            </span>{" "}
            Quiz <br /> Created
          </p>
        </div>
        <div className={styles.countsDiv}>
          <p className={styles.countInfo} style={{ color: "#60B84B" }}>
            <span className={styles.count} style={{ color: "#60B84B" }}>
              {totalQuetions}
            </span>{" "}
            Quetions <br /> Created
          </p>
        </div>
        <div className={styles.countsDiv}>
          <p className={styles.countInfo} style={{ color: "#5076FF" }}>
            <span className={styles.count} style={{ color: "#5076FF" }}>
              {formatImpressions(totalImpressions)}
            </span>{" "}
            Total <br /> Impressions
          </p>
        </div>
      </div>
      <div className={styles.section2}>
        <h2 className={styles.section2Heading}>Trending Quizs</h2>
        <div className={styles.trendingDivContainer}>
        {quizzes.map(
          (quiz) =>
            quiz.impressions > 10 && (
              <div key={quiz._id} className={styles.trendingDiv}>
                <div className={styles.quizInfo}>
                  <h2 className={styles.quizName}>{quiz.name}</h2>
                  <div className={styles.impressionsDiv} >
                    <p className={styles.impressions}>{quiz.impressions}</p>
                    <img src={eye} height={"15px"} alt="eye" />
                  </div>
                </div>
                <p className={styles.createdDate}>created on {formatDate(quiz.createdAt)}</p>
              </div>
            )
        )}
        </div>
       
      </div>
    </div>
  );
};

export default QuizList;
