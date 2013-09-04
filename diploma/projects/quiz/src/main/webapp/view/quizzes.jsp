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
            <c:forEach items="${quizzes}" var="quiz" varStatus="loop">

                <c:url var="doStart" value="/quiz">
                    <c:param name="quizId" value="${quiz.id}" />
                </c:url>

                <c:set var="isCompleted" value="${results.containsKey(quiz.id)}" />

                <form action="${doStart}" method="POST">
                    <div class="row-fluid">
                        <c:if test="${not isCompleted}">
                            <div class="pull-right">
                                <span class="label label-success"><fmt:message
                                        key="quiz.new" /></span>
                            </div>
                        </c:if>

                        <h3>
                            <strong>${quiz.title}</strong>
                        </h3>

                        <c:if test="${isCompleted}">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>
                                            <fmt:message
                                                key="quiz.result.completed" />
                                        </th>
                                        <th>
                                            <fmt:message key="quiz.result.total" />
                                        </th>
                                        <th>
                                            <fmt:message
                                                key="quiz.result.correct" />
                                        </th>
                                        <th>
                                            <fmt:message key="quiz.result.value" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:set var="result"
                                        value="${results.get(quiz.id)}" />
                                    <tr>
                                        <td>
                                            <fmt:formatDate type="date"
                                                dateStyle="short"
                                                value="${result.completed}" />
                                        </td>
                                        <td>${result.total}</td>
                                        <td>${result.correct}</td>
                                        <td>
                                            <fmt:formatNumber type="percent"
                                                minFractionDigits="2"
                                                value="${result.value}" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </c:if>

                        <div class="pull-right">
                            <c:url var="doStart" value="/quiz">
                                <c:param name="quizId" value="${quiz.id}" />
                            </c:url>
                            <a href="${doStart}" class="btn btn-primary btn-large">
                                <fmt:message key="quiz.start" />
                            </a>
                        </div>
                    </div>
                    <hr>
                </form>
            </c:forEach>
        </div>
    </div>

    <script src="<c:url value="/assets/js/jquery.js" />"></script>
    <script src="<c:url value="/assets/js/bootstrap.js" />"></script>
</body>

</html>
