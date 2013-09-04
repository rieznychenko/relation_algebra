package oreznichenko.quiz.controller;

import java.security.Principal;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import oreznichenko.quiz.model.Answer;
import oreznichenko.quiz.model.Question;
import oreznichenko.quiz.model.Quiz;
import oreznichenko.quiz.model.Result;
import oreznichenko.quiz.model.User;
import oreznichenko.quiz.repository.QuizRepository;
import oreznichenko.quiz.repository.ResultRepository;
import oreznichenko.quiz.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

/**
 * Processes a requests for managing books.
 */
@Controller
@RequestMapping("/quiz")
@SessionAttributes({ "user", "quiz" })
public class QuizController {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(QuizController.class);

    @Autowired
    UserService userService;
    @Autowired
    QuizRepository quizRepository;
    @Autowired
    ResultRepository resultRepository;

    @ModelAttribute("user")
    public User getUser(Principal principal) {
        String username = principal.getName();
        User user = userService.get(username);
        LOGGER.debug("User {} has role {}.", user.getName(), user.getRole());
        return user;
    }

    @RequestMapping(method = RequestMethod.GET)
    public String getQuiz(@ModelAttribute("user") User user,
            @RequestParam("quizId") Long quizId, Model model) {
        LOGGER.debug("User {} starts quiz {}.", user.getName(), quizId);

        Quiz quiz = quizRepository.findOne(quizId);
        model.addAttribute("quiz", quiz);

        return "quiz";
    }

    @RequestMapping(params = "complete", method = RequestMethod.POST)
    public String completeQuiz(
            @ModelAttribute("user") User user,
            @ModelAttribute("quiz") Quiz quiz,
            @RequestParam(value = "selectedAnswers", required = false) String[] selectedAnswers,
            Model model) {
        LOGGER.debug("User {} completes quiz {}.", user.getName(), quiz.getId());
        if (selectedAnswers == null) {
            selectedAnswers = new String[0];
        }

        Result result = getResult(user, quiz, Arrays.asList(selectedAnswers));
        Result bestResult = resultRepository.findByQuizIdAndUserId(
                quiz.getId(), user.getId());
        if (bestResult == null) {
            resultRepository.save(result);
        } else {
            if (bestResult.getValue() < result.getValue()) {
                result.setId(bestResult.getId());
                resultRepository.save(result);
            }
        }

        model.addAttribute("result", result);

        return "results";
    }

    private Result getResult(User user, Quiz quiz, List<String> selectedAnswers) {
        int correct = 0;
        for (Question question : quiz.getQuestions()) {
            boolean isCorrect = true;
            for (Answer answer : question.getAnswers()) {
                String id = question.getId() + "_" + answer.getId();
                if (answer.getCorrect() && !selectedAnswers.contains(id)
                        || !answer.getCorrect() && selectedAnswers.contains(id)) {
                    isCorrect = false;
                    break;
                }
            }
            if (isCorrect) {
                ++correct;
            }
        }

        int total = quiz.getQuestions().size();
        double value = (1.0 * correct) / total;

        Result result = new Result();
        result.setUser(user);
        result.setQuiz(quiz);
        result.setCompleted(new Date());
        result.setTotal(total);
        result.setCorrect(correct);
        result.setValue(value);
        return result;
    }

}
