package oreznichenko.quiz.repository;

import java.util.List;

import oreznichenko.quiz.model.Result;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository of results.
 */
public interface ResultRepository extends JpaRepository<Result, Long> {

    Result findByQuizIdAndUserId(Long quizId, Long userId);

    List<Result> findByQuizId(Long id);

}
