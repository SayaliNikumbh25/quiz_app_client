import React from "react";
import { getQuizResult } from "../services/api.js";
import { useEffect, useState } from "react";
import styles from "./QuestionAnalysis.module.css";

const QuetionAnalysis = ({ id, quiz, formatDate }) => {
  console.log(id, "id");

  const [results, setResults] = useState([]);
  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const response = await getQuizResult(id);
      setResults(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAttemptedCount = (questionId) => {
    return results.filter((result) =>
      result.answers.some((answer) => answer.questionId === questionId)
    ).length;
  };

  const getCorrectCount = (questionId, correctAnswer) => {
    return results.filter((result) =>
      result.answers.some(
        (answer) => answer.questionId === questionId && answer.isCorrect
      )
    ).length;
  };

  const getIncorrectCount = (questionId, correctAnswer) => {
    return results.filter((result) =>
      result.answers.some(
        (answer) => answer.questionId === questionId && !answer.isCorrect
      )
    ).length;
  };

  const getPollOptionCounts = (questionId) => {
    const optionCounts = {};
    results.forEach((result) => {
      const answer = result.answers.find(
        (answer) => answer.questionId === questionId
      );
      if (answer) {
        const optionIndex = answer.selectedOption;
        if (optionCounts[optionIndex]) {
          optionCounts[optionIndex] += 1;
        } else {
          optionCounts[optionIndex] = 1;
        }
      }
    });
    return optionCounts;
  };

  console.log(quiz);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.headingDiv}>
        <h2 className={styles.heading}>{quiz.name} Question Analysis</h2>
        <div>
          <p className={styles.para}>
            Created On : {formatDate(quiz.createdAt)}
          </p>
          <p className={styles.para}>Impressions : {quiz.impressions}</p>
        </div>
      </div>
      <div className={styles.Container}>
        {quiz.questions.map((question, idx) => (
          <div key={idx} className={styles.questionDiv}>
            <h3 className={styles.question}>
              Q.{idx + 1} {question.question} ?{" "}
            </h3>
            {quiz.type == "q&a" && (
              <div className={styles.optionDiv}>
                <div className={styles.option}>
                  <h4 className={styles.count}>{getAttemptedCount(question._id)}</h4>
                  <p className={styles.countInfo}>people Attempted the question</p>
                </div>
                <div className={styles.option}>
                  <h4 className={styles.count}>
                    {getCorrectCount(question._id, question.correctAnswer)}
                  </h4>
                  <p className={styles.countInfo}>people Answered Correctly</p>
                </div>
                <div className={styles.option}>
                  <h4 className={styles.count}>
                    {getIncorrectCount(question._id, question.correctAnswer)}
                  </h4>
                  <p className={styles.countInfo}>people Answered Incorrectly</p>
                </div>
              </div>
            )}

            {quiz.type == "poll" && (
              <div className={styles.pollOptionDiv}>
                {question.options.map((option, optionIdx) => {
                  const optionCounts = getPollOptionCounts(question._id);
                  return (
                    <div key={optionIdx} className={styles.pollOption}>
                      <h4 className={styles.count}>{optionCounts[optionIdx] || 0}</h4>
                      <p className={styles.pollCountInfo}>Option {optionIdx+1}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuetionAnalysis;
