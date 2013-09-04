<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html>

<html>

<head>
<meta charset="utf-8">

<title>Quiz</title>

<link href="<c:url value="/assets/css/bootstrap.css" />" rel="stylesheet"
    media="screen" />
</head>

<body>
    <div class="container">
        <jsp:include page="header.jsp" />

        <div class="row-fluid">
            <h3>${quiz.title}</h3>
            <hr />

            <c:url var="doComplete" value="/quiz">
                <c:param name="quizId" value="${quiz.id}" />
            </c:url>

            <form action="${doComplete}" method="POST">
                <c:forEach items="${quiz.questions}" var="question"
                    varStatus="loop">
                    <p>
                        <strong>${question.content}</strong> <br />
                    </p>
                    <p>
                        <c:forEach items="${question.answers}" var="answer"
                            varStatus="loop">
                            <label class="checkbox">
                                <input type="checkbox" name="selectedAnswers"
                                    value="${question.id}_${answer.id}">
                                ${answer.content}
                            </label>
                            <br>
                        </c:forEach>
                    </p>
                    <hr />
                </c:forEach>

                <div class="pull-right">
                    <p>
                        <button name="complete" type="submit"
                            class="btn btn-primary btn-large">
                            <fmt:message key="quiz.complete" />
                        </button>
                    </p>
                </div>
            </form>
        </div>
    </div>

    <script src="<c:url value="/assets/js/jquery.js" />"></script>
    <script src="<c:url value="/assets/js/bootstrap.js" />"></script>
</body>

</html>