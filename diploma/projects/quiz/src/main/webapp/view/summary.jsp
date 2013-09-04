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
                <div class="row-fluid">
                    <h3>
                        <strong>${quiz.title}</strong>
                    </h3>

                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>
                                    <fmt:message key="quiz.user.fullname" />
                                </th>
                                <th>
                                    <fmt:message key="quiz.user.party" />
                                </th>
                                <th>
                                    <fmt:message key="quiz.result.completed" />
                                </th>
                                <th>
                                    <fmt:message key="quiz.result.total" />
                                </th>
                                <th>
                                    <fmt:message key="quiz.result.correct" />
                                </th>
                                <th>
                                    <fmt:message key="quiz.result.value" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach items="${results.get(quiz.id)}"
                                var="result" varStatus="loop">
                                <tr>
                                    <td>${result.user.fullname}</td>
                                    <td>${result.user.party}</td>
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
                            </c:forEach>
                        </tbody>
                    </table>
                </div>
                <hr />
            </c:forEach>
        </div>
    </div>

    <script src="<c:url value="/assets/js/jquery.js" />"></script>
    <script src="<c:url value="/assets/js/bootstrap.js" />"></script>
</body>

</html>
