package oreznichenko.quiz.repository;

import oreznichenko.quiz.model.Quiz;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository of quizzes.
 */
public interface QuizRepository extends JpaRepository<Quiz, Long> {

}
