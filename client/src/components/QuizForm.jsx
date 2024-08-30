import React, { useState, useEffect } from "react";
import { createQuiz, getQuiz, updateQuiz } from "../services/api.js";
import Question from "./Question.jsx";
import styles from "./QuizForm.module.css";
import cross from "../assets/cross.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuizForm = ({
  handleShare,
  shareLink,
  setShowCreateQuiz,
  editQuiz,
  setShowEditQuiz,
}) => {
  const [quiz, setQuiz] = useState({ name: "", type: "q&a", questions: [] });
  const [step, setStep] = useState(1); // Step of the form
  const [quizId, setQuizId] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(null); // Index of the currently visible question form
  const token = localStorage.getItem("token");
  console.log("editQuiz", editQuiz);
  useEffect(() => {
    if (editQuiz) {
      console.log("here", editQuiz);
      setQuiz("editQuiz", editQuiz);
      //setQuiz(quiz.name = editQuiz.name);
      setQuiz({ ...quiz, name: editQuiz.name, type: editQuiz.type });
      console.log("quiz", quiz);
      setStep(1); // Directly go to question editing step
      setCurrentQuestionIdx(0); // Show the first question form
    }
  }, [editQuiz]);

  // Handlers for quiz info
  const handleQuizNameChange = (e) => {
    setQuiz({ ...quiz, name: e.target.value });
  };

  const handleQuizTypeChange = (type) => {
    setQuiz({ ...quiz, type });
  };

  // Handlers for question and options
  const handleQuestionChange = (e, idx) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[idx].question = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIdx, optionIdx, e = null) => {
    const updatedQuestions = [...quiz.questions];
    if (e) {
      updatedQuestions[questionIdx].options[optionIdx].value = e.target.value;
    } else {
      updatedQuestions[questionIdx].correctAnswer = optionIdx;
    }
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionTypeChange = (questionIdx, optionIdx, type) => {
    console.log(questionIdx, optionIdx, type);
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIdx].options[optionIdx].description = type;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleTimerChange = (questionIdx, timerValue) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIdx].timer = timerValue;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleQuestionTypeChange = (questionIdx, type) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIdx].questionType = type;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addOption = (questionIdx) => {
    const updatedQuestions = [...quiz.questions];
    if (updatedQuestions[questionIdx].options.length < 4) {
      updatedQuestions[questionIdx].options.push({
        value: "",
        description: "",
      });
      setQuiz({ ...quiz, questions: updatedQuestions });
    }
  };

  const handelOptionDelete = (questionIdx, optIdx) => {
    const updatedQuestions = [...quiz.questions];
    const updatedOptions = updatedQuestions[questionIdx].options.filter(
      (_, ind) => ind !== optIdx
    );
    updatedQuestions[questionIdx].options = updatedOptions;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    const currentQuestion = quiz.questions[currentQuestionIdx]
    if(currentQuestion.question && currentQuestion.options.every((o) => o.value)){
      setQuiz({
        ...quiz,
        questions: [
          ...quiz.questions,
          {
            question: "",
            options: [
              { value: "", description: "" },
              { value: "", description: "" },
            ],
            correctAnswer: 0,
            timer: 0,
            questionType: "text",
          }, // Default values
        ],
      });
      setCurrentQuestionIdx(quiz.questions.length); 
    }
    else{
      toast.error(`Please enter ${quiz.questions[currentQuestionIdx].question?'Options':'question'}`)
    }
    // Set to the new question's index
  };

  const handleDeleteQuestion = (idx) => {
    const updatedQuestions = quiz.questions.filter((_, ind) => ind !== idx);

    setQuiz({ ...quiz, questions: updatedQuestions });
    setCurrentQuestionIdx(idx - 1);
  };

  const handleContinue = () => {
    // Add a default first question
    console.log(quiz);
    if (editQuiz) {
      setQuiz({ ...quiz, questions: editQuiz.questions });
      setCurrentQuestionIdx(0);
      console.log("quiz", quiz); // Automatically show the first question form
      setStep(2);
    } else {
      if (quiz.name) {
        setQuiz({
          ...quiz,
          questions: [
            {
              question: "",
              options: [
                { value: "", description: "" },
                { value: "", description: "" },
              ],
              correctAnswer: 0,
              timer: 0,
              questionType: "text",
            },
          ],
        });
        setCurrentQuestionIdx(0); // Automatically show the first question form
        setStep(2);
      }else{
        toast.error(`Please Enter Quiz Name`)
      }
    } // Move to step 2 (Question form)
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

  const isValidQuiz = quiz.questions.every((question, index) => {
    if (!question.question) {
      toast.error(`Please enter the question for question ${index + 1}`);
      return false;
    }
    if (!question.options.every((option) => option.value)) {
      toast.error(`Please fill in all options for question ${index + 1}`);
      return false;
    }
    return true;
  });

  if (!isValidQuiz) {
    return; // Prevent submission if validation fails
  }
    
    try {
      console.log(quiz);
      let res = {};
      if (editQuiz) {
        res = await updateQuiz(editQuiz._id, quiz, token);
        console.log(res);
      } else {
        res = await createQuiz(quiz, token);
        localStorage.setItem("quizId", res.data._id);
      }
      setQuizId(res.data._id);

      setStep(3); // Move to step 3 (Share popup)
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelButton = () => {
    setShowCreateQuiz(false);
    setShowEditQuiz(false);
    setStep(0);
  };

  return (
    <div className={styles.popupContainer}>
      {/* Step 1: Quiz Info Popup */}
      {step === 1 && (
        <div className={styles.popup}>
          <input
            type="text"
            value={quiz.name}
            onChange={handleQuizNameChange}
            placeholder="Quiz Name"
            required
            className={styles.inputQuestion}
            disabled={!!editQuiz}
          />
          <div className={styles.questionTypeDiv}>
            <p className={styles.para}>Quiz Type</p>
            <button
              onClick={() => handleQuizTypeChange("q&a")}
              className={`${styles.buttons}`}
              style={{
                backgroundColor: quiz.type == "q&a" && "#60B84B",
                color: quiz.type == "q&a" && "white",
              }}
              disabled={!!editQuiz}
            >
              Q & A
            </button>
            <button
              className={styles.buttons}
              onClick={() => handleQuizTypeChange("poll")}
              disabled={!!editQuiz}
              style={{
                backgroundColor: quiz.type == "poll" && "#60B84B",
                color: quiz.type == "poll" && "white",
              }}
            >
              Poll
            </button>
          </div>

          <div className={styles.popupActions}>
            <button
              className={styles.actionsButtons}
              onClick={handleCancelButton}
            >
              Cancel
            </button>
            <button className={styles.actionsButtons} onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Questions Popup */}
      {step === 2 && (
        <div className={styles.popup}>
          <div className={styles.questionDiv}>
            {/* Question Navigation Buttons */}
            <div className={styles.quetionNo}>
              {quiz.questions.map((_, idx) => (
                <div key={idx} className={styles.QuestionNoDiv}>
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={styles.qeustionButton}
                  >
                    {idx + 1}
                  </button>
                  {idx > 0 && (
                    <button
                      className={styles.deleteQuetionButton}
                      onClick={() => handleDeleteQuestion(idx)}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              {quiz.questions.length < 5 && (
                <button
                  type="button"
                  onClick={addQuestion}
                  className={styles.addQeutionButton}
                  
                >
                  +
                </button>
              )}
            </div>

            <p>Max 5 questions</p>
          </div>

          {/* Show the current question form */}
          {quiz.questions[currentQuestionIdx] && (
            <Question
              question={quiz.questions[currentQuestionIdx]}
              idx={currentQuestionIdx}
              quizType={quiz.type}
              handleQuestionChange={handleQuestionChange}
              handleOptionChange={handleOptionChange}
              addOption={addOption}
              handelOptionDelete={handelOptionDelete}
              handleTimerChange={handleTimerChange}
              handleQuestionTypeChange={handleQuestionTypeChange}
              handleOptionTypeChange={handleOptionTypeChange}
              editQuiz={editQuiz}
            />
          )}

          <div className="popup-actions">
            <button
              className={styles.actionsButtons}
              onClick={() => setStep(1)}
            >
              Cancel
            </button>
            <button className={styles.actionsButtons} onClick={handleSubmit}>
              {editQuiz ? "Update Quiz" : "Create Quiz"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Share Popup */}
      {step === 3 && (
        <div className={styles.popup}>
          <div className={styles.SharePopUp}>
            <h2 className={styles.headings}>
              Congrats your Quiz is Published!
            </h2>
            <div className={styles.paraDiv}>
              <p className={styles.linkInfo}>your link is here</p>
            </div>
            <button
              style={{ backgroundColor: "#60B84B", color: "white" }}
              className={styles.actionsButtons}
              onClick={() => {editQuiz? handleShare(editQuiz._id) :handleShare(quizId)}}
            >
              Share
            </button>
          </div>
          <div
            className={styles.cancelButton}
            onClick={() => {
              setShowCreateQuiz(false);
              setShowEditQuiz(false);
            }}
          >
            x
          </div>
        </div>
      )}

<ToastContainer />
    </div>
  );
};

export default QuizForm;
