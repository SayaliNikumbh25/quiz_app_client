import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuiz, submitQuizResult } from "../services/api.js";
import styles from "./QuizTake.module.css";
import result from '../assets/result.png'

const QuizTake = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [recordId, setRecordId] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [flag, setFlag] = useState(false); // Flag to control timer submission

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await getQuiz(id);
        setQuiz(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    setAnswers(answers);
  }, [answers]);

  const handleAnswerChange = (questionId, optionIdx) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: optionIdx,
    };
    setAnswers(updatedAnswers);
    console.log(questionId, optionIdx);
    console.log(updatedAnswers); // This logs the new state
  };

  useEffect(() => {
    if (quiz && quiz.questions[currentQuestionIdx]) {
      const currentQuestion = quiz.questions[currentQuestionIdx];
      const timerInSeconds = currentQuestion.timer;
      if (timerInSeconds > 0) {
        setTimeLeft(timerInSeconds);
        const timerId = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timerId);
              if (!flag) {
                handleAnswerChange(quiz.questions[currentQuestionIdx]._id, 5);
                handleAutoSubmit();
              }
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
        setTimer(timerId);
      } else {
        setTimeLeft(0);
      }
    }

    return () => clearInterval(timer);
  }, [currentQuestionIdx, quiz, flag]);

  const handleAutoSubmit = () => {
    handleSubmit(false, {
      ...answers,
      [quiz.questions[currentQuestionIdx]._id]: 5,
    });
  };

  const handleSubmit = async (finalizing = false, updatedAnswers = answers) => {
    if (quiz && quiz.questions[currentQuestionIdx]) {
      const currentQuestion = quiz.questions[currentQuestionIdx];
      let selectedOption = updatedAnswers[currentQuestion._id];

      try {
        const data = {
          quizId: id,
          answers: Object.keys(updatedAnswers).map((questionId) => ({
            questionId,
            selectedOption:
              updatedAnswers[questionId] !== undefined
                ? updatedAnswers[questionId]
                : 5,
          })),
          recordId: recordId,
        };

        const res = await submitQuizResult(data);
        setScore(res.data.result.score);

        if (!recordId) {
          setRecordId(res.data.result._id);
        }

        if (!finalizing) {
          if (currentQuestionIdx < quiz.questions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
            setFlag(false);
          } else {
            setSubmitted(true);
          }
        } else {
          setSubmitted(true);
        }
      } catch (error) {
        console.log("Error submitting answer:", error);
      }
    }
  };

  const handleNext = () => {
    setFlag(true); // Set flag to true when "Next" is clicked
    handleSubmit(false);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    handleSubmit(true);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.quetionContainer}>
        {quiz && !submitted && (
          <form onSubmit={handleFinalSubmit}>
            <div className={styles.header}>
              <h4 className={styles.heading}>
                0{currentQuestionIdx + 1}/0{quiz.questions.length}
              </h4>
              {quiz.questions[currentQuestionIdx].timer > 0 && (
                <h4 className={styles.heading} style={{ color: "#D60000" }}>
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}s
                </h4>
              )}
            </div>

            <div>
              <h4 className={styles.heading}>
                {quiz.questions[currentQuestionIdx].question}
              </h4>
              <div className={styles.container}>
                <div className={styles.optionContainer}>
                  {quiz.questions[currentQuestionIdx].options.map(
                    (option, optIdx) => {
                      const isSelected =
                        answers[quiz.questions[currentQuestionIdx]._id] ===
                        optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() =>
                            handleAnswerChange(
                              quiz.questions[currentQuestionIdx]._id,
                              optIdx
                            )
                          }
                        >
                          {quiz.questions[currentQuestionIdx].questionType ===
                            "text" && (
                            <div
                              className={styles.textOptionDiv}
                              style={{
                                border: isSelected
                                  ? "4px solid #5076FF"
                                  : "none",
                              }}
                            >
                              <p className={styles.option}>{option.value}</p>
                            </div>
                          )}
                          {quiz.questions[currentQuestionIdx].questionType ===
                            "image" && (
                            <div
                              className={styles.ImageOptionDiv}
                              style={{
                                border: isSelected
                                  ? "4px solid #5076FF"
                                  : "none",
                              }}
                            >
                              <img
                                src={option.value}
                                className={styles.images}
                                alt={`Option ${optIdx + 1}`}
                              />
                            </div>
                          )}
                          {quiz.questions[currentQuestionIdx].questionType ===
                            "imageWithText" && (
                            <div
                              style={{
                                border: isSelected
                                  ? "4px solid #5076FF"
                                  : "none",
                              }}
                              className={styles.textImageDiv}
                            >
                              <p className={styles.option}>
                                {option.description}
                              </p>
                              <img
                                src={option.value}
                                className={styles.TextImage}
                                alt={`Option ${optIdx + 1}`}
                              />
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            <div className={styles.buttonDiv}>
              {currentQuestionIdx < quiz.questions.length - 1 && (
                <button
                  className={styles.buttons}
                  type="button"
                  onClick={handleNext}
                >
                  Next
                </button>
              )}
              {currentQuestionIdx === quiz.questions.length - 1 && (
                <button className={styles.buttons} type="submit">
                  Submit Quiz
                </button>
              )}
            </div>
          </form>
        )}

        {submitted && quiz.type === "q&a" && (
          <div className={styles.resultContainer}> 
            <h3 className={styles.result}>Congrats Quiz is completed</h3>
            <div ><img src={result} className={styles.resultImage} alt="" /></div>
            <h3 className={styles.result}>
              Your Score: <span style={{color:'#60B84B'}}> 0{score} / 0{quiz.questions.length}</span> 
            </h3>
          </div>
        )}

        {submitted && quiz.type === "poll" && (
          <div className={styles.pollContainer}>
            <h3 className={styles.pollHeading}>Thank you <br/> for participating in the Poll !!!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTake;
