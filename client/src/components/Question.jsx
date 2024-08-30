import React from "react";
import { useState, useEffect } from "react";
import styles from "./QuizForm.module.css";
import deletebutton from "../assets/deletebutton.png";

const Question = ({
  question,
  idx,
  quizType,
  handleQuestionChange,
  handleOptionChange,
  addOption,
  handelOptionDelete,
  handleTimerChange,
  handleQuestionTypeChange,
  handleOptionTypeChange,
  editQuiz,
}) => {
  const [description, setDescription] = useState("");
  const [selectedTimer, setSelectedTimer] = useState(0);
  return (
    <div>
      <input
        type="text"
        value={question.question}
        className={styles.inputQuestion}
        style={{ margin: "1rem" }}
        onChange={(e) => handleQuestionChange(e, idx)}
        placeholder="Question"
        required
      />

      {/* Question Type Selection */}
      <div className={styles.optionTypeDiv}>
        <p>Option Type</p>
        <div style={{ display: "flex", marginLeft: "2rem" }}>
          <div className={styles.optionsType}>
            <label>
              <input
                type="radio"
                value="text"
                style={{ accentColor: "black" }}
                checked={question.questionType === "text"}
                disabled={!!editQuiz}
                onChange={() => handleQuestionTypeChange(idx, "text")}
              />
              Text
            </label>
          </div>
          <div className={styles.optionsType}>
            <label>
              <input
                type="radio"
                value="image"
                style={{ accentColor: "black" }}
                checked={question.questionType === "image"}
                disabled={!!editQuiz}
                onChange={() => handleQuestionTypeChange(idx, "image")}
              />
              Image URL
            </label>
          </div>
          <div className={styles.optionsType}>
            <label>
              <input
                type="radio"
                value="imageWithText"
                style={{ accentColor: "black" }}
                checked={question.questionType === "imageWithText"}
                disabled={!!editQuiz}
                onChange={() => handleQuestionTypeChange(idx, "imageWithText")}
              />
              Text & Image URL
            </label>
          </div>
        </div>
      </div>

      <div className={styles.optionContainer}>
        <div className={styles.options}>
          {question.options.map((option, optIdx) => (
            <div key={optIdx} style={{ display: "flex" }}>
              {
                /* Render option based on the selected question type */ console.log(
                  optIdx,
                  question.correctAnswer
                )
              }
              {quizType === "q&a" && (
                <input
                  type="radio"
                  name={`correctAnswer-${idx}`}
                  value={optIdx}
                  className={styles.radio}
                  style={{ accentColor: "#60B84B" }}
                  disabled={!!editQuiz}
                  checked={Number(question.correctAnswer) === optIdx}
                  onChange={() => handleOptionChange(idx, optIdx)}
                />
              )}

              {question.questionType === "text" && (
                <input
                  type="text"
                  className={styles.optionInput}
                  value={option.value}
                  style={{
                    backgroundColor:
                    (question.correctAnswer == optIdx && quizType === "q&a") && "#60B84B",
                    color: (question.correctAnswer == optIdx && quizType === "q&a") && "white",
                    
                  }}
                  onChange={(e) => handleOptionChange(idx, optIdx, e)}
                  placeholder={`Text`}
                  required
                />
              )}

              {question.questionType === "image" && (
                <input
                  type="url"
                  value={option.value}
                  className={styles.optionInput}
                  onChange={(e) => handleOptionChange(idx, optIdx, e)}
                  style={{
                    backgroundColor:
                    (question.correctAnswer == optIdx && quizType === "q&a") && "#60B84B",
                    color: (question.correctAnswer == optIdx && quizType === "q&a") && "white",
                    
                  }}
                  placeholder="Image URL"
                  required
                />
              )}

              {question.questionType === "imageWithText" && (
                <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    value={option.description}
                    className={styles.optionInput}
                    onChange={(e) => {
                      handleOptionTypeChange(idx, optIdx, e.target.value);
                    }}
                    style={{
                      width: "10rem",
                      backgroundColor:
                      (question.correctAnswer == optIdx && quizType === "q&a") && "#60B84B",
                      color: (question.correctAnswer == optIdx && quizType === "q&a") && "white",
                      
                    }}
                    placeholder="Text"
                    required
                  />
                  <input
                    type="url"
                    value={option.value}
                    style={{
                      width: "13rem",
                      backgroundColor:
                        (question.correctAnswer == optIdx && quizType === "q&a") && "#60B84B",
                      color: (question.correctAnswer == optIdx && quizType === "q&a") && "white",
                      
                    }}
                    className={styles.optionInput}
                    onChange={(e) => handleOptionChange(idx, optIdx, e)}
                    placeholder={`Image URL ${optIdx + 1}`}
                    required
                  />
                </div>
              )}
              {optIdx > 1 && (
                <button
                  onClick={() => handelOptionDelete(idx, optIdx)}
                  className={styles.deletebutton}
                  disabled={!!editQuiz}
                >
                  <img src={deletebutton} alt="delete" />
                </button>
              )}
            </div>
          ))}

          {/* Add Option Button */}
          {question.options.length < 4 && (
            <button
              type="button"
              onClick={() => addOption(idx)}
              style={{ marginLeft: "2rem" }}
              className={styles.optionInput}
              disabled={question.options.length >= 4 || !!editQuiz}
            >
              Add Option
            </button>
          )}
        </div>
        <div className={styles.timerDiv}>
          {/* Timer Selection */}
          {quizType === "q&a" && (
            <div className={styles.timer}>
              <label>Timer</label>
              <button
                className={styles.timerButtons}
                style={{
                  backgroundColor: selectedTimer == 0 && "#D60000",
                  color: selectedTimer == 0 && "white",
                }}
                onClick={() => {
                  handleTimerChange(idx, 0);
                  setSelectedTimer(0);
                }}
              >
                Off
              </button>
              <button
                className={styles.timerButtons}
                style={{
                  backgroundColor: selectedTimer == 5 && "#D60000",
                  color: selectedTimer == 5 && "white",
                }}
                onClick={() => {
                  handleTimerChange(idx, 5);
                  setSelectedTimer(5);
                }}
              >
                5 sec
              </button>
              <button
                className={styles.timerButtons}
                style={{
                  backgroundColor: selectedTimer == 10 && "#D60000",
                  color: selectedTimer == 10 && "white",
                }}
                onClick={() => {
                  handleTimerChange(idx, 10);
                  setSelectedTimer(10);
                }}
              >
                10 sec
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
