<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page errorPage="error.jsp" %>
<%@ page import="java.util.Vector" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Translator</title>
    <link rel='shortcut icon' type='image/x-icon' href='images/bi.png'/>
    <link rel="stylesheet" href="css/translate.css">
    <link rel="stylesheet" href="css/login.css">
    <script type="text/javascript" src="js/operations.js"></script>
    <script type="text/javascript" src="js/validate.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
    <link href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/js/bootstrap-datepicker.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/css/bootstrap-datepicker3.css"/>

    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/jquery.bootstrapvalidator/0.5.3/css/bootstrapValidator.min.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-validator/0.5.1/js/bootstrapValidator.min.js"></script>
</head>

<body>
<%@include file="header.jsp" %>

<%
    session.setAttribute("user", session.getAttribute("username"));
    out.println("<div id=\"session\" class=\"alert alert-info\" role=\"alert\">");
    out.println("Logged in as <strong><u>" + session.getAttribute("username") + "</u></strong>");
    out.println("<br><form action=\"logout\" method=\"post\"><table><tr><button type=\"submit\" class=\"btn btn-info btn-xs\" id=\"logout\"><span class=\"glyphicon glyphicon-off\"></span>&nbsp;&nbsp;&nbsp;Logout</button></tr></table></form></div>");
%>

<div id="sep">
</div>

<div id="translate">
    <ul class="nav nav-pills">
        <li class="active"><a data-toggle="tab" href="#home">Translate Text</a></li>
        <li class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown">User Management
                <span class="caret"></span></a>
            <ul class="dropdown-menu">
                <li><a data-toggle="tab" href="#addUser">Add user</a></li>
                <li><a data-toggle="tab" href="#searchUser">Search user</a></li>
            </ul>
    </ul>

    <div class="tab-content">
        <div id="home" class="tab-pane fade in active">
            <%@include file="translate.jsp" %>
        </div>
        <div id="addUser" class="tab-pane fade">
            <%@include file="register.jsp" %>
        </div>
        <div id="searchUser" class="tab-pane fade">
            <%@include file="search.jsp" %>
        </div>
    </div>
</div>

<script>
    var date_input = $('input[name="date"]');
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    var options = {
        format: 'yyyy-mm-dd ',
        container: container,
        todayHighlight: true,
        autoclose: true,
        weekStart: 1,
        orientation: "top left",
        daysOfWeekHighlighted: "0,6",
        todayBtn: true
    };
    date_input.datepicker(options);

</script>

</body>
</html>