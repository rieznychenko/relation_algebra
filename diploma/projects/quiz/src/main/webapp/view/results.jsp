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

        <div class="jambotron">
            <h1 class="text-center text-info">
                <fmt:message key="quiz.result">
                    <fmt:param>
                        <fmt:formatNumber type="percent" minFractionDigits="2"
                            value="${result.value}" />
                    </fmt:param>
                </fmt:message>
            </h1>

            <c:url var="goBack" value="/quizzes" />
            <c:url var="doRetry" value="/quiz">
                <c:param name="quizId" value="${quiz.id}" />
            </c:url>

            <p>
                <a href="${goBack}" class="btn btn-primary btn-large">
                    <fmt:message key="quiz.back" />
                </a>
                <a href="${doRetry}" class="btn btn-large">
                    <fmt:message key="quiz.retry" />
                </a>
            </p>
        </div>

    </div>

    <script src="<c:url value="/assets/js/jquery.js" />"></script>
    <script src="<c:url value="/assets/js/bootstrap.js" />"></script>
</body>

</html>
