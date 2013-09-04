package oreznichenko.quiz.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import oreznichenko.quiz.model.Quiz;
import oreznichenko.quiz.model.Result;
import oreznichenko.quiz.model.User;
import oreznichenko.quiz.model.UserRole;
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
import org.springframework.web.bind.annotation.SessionAttributes;

@Controller
@SessionAttributes("user")
public class QuizzesController {

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

    @RequestMapping(value = "/quizzes", method = RequestMethod.GET)
    public String getQuizzes(@ModelAttribute("user") User user, Model model) {
        if (user.getRole() == UserRole.LECTURER) {
            return "redirect:/summary";
        }

        List<Quiz> quizzes = quizRepository.findAll();

        model.addAttribute("quizzes", quizzes);
        model.addAttribute("results", getResults(user, quizzes));

        return "quizzes";
    }

    private Map<Long, Result> getResults(User user, List<Quiz> quizzes) {
        Map<Long, Result> bestResults = new HashMap<>();

        for (Quiz quiz : quizzes) {
            Long quizId = quiz.getId();
            Result result = resultRepository.findByQuizIdAndUserId(quizId,
                    user.getId());
            if (result != null) {
                LOGGER.debug("Found result for quiz {}.", quizId);
                bestResults.put(quizId, result);
            }
        }

        return bestResults;
    }

    @RequestMapping(value = "/summary", method = RequestMethod.GET)
    public String getSummary(@ModelAttribute("user") User user, Model model) {
        List<Quiz> quizzes = quizRepository.findAll();

        Map<Long, List<Result>> results = new HashMap<>();
        for (Quiz quiz : quizzes) {
            List<Result> quizResults = resultRepository
                    .findByQuizId(quiz.getId());
            results.put(quiz.getId(), quizResults);
        }

        model.addAttribute("quizzes", quizzes);
        model.addAttribute("results", results);

        return "summary";
    }

}
